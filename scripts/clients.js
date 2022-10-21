import { sys } from 'typescript';
import { resolve } from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';

/**
 * @typedef {{
 *  requestLib: {
 *    importSource: string;
 *    requestMethod: string;
 *    namedExports?: boolean;
 *    clientName: string;
 *  },
 *  schema: string
 * }} ClientItem
 */

const Key = `clients`;

/**
 * Hash Encode
 * @param {string} content
 * @returns
 */
const hash = (content) => {
  return crypto.createHash('sha256').update(content).digest('hex');
};

/**
 *
 * Get openapi docs and hash comparation
 * @param {string} schemaUrl
 * @param {string} clientPath
 * @returns {Promise<{ jsonDocString: string; hasModified: boolean  }>}
 */
const gotAndCompare = (schemaUrl, clientPath) => {
  const relHashPath = resolve(clientPath, 'hash.checksum');

  const oldHash = sys.readFile(relHashPath);

  console.log(`Fetch doc from ${schemaUrl}`);

  return new Promise((resolve, reject) => {
    let chunks = ``;

    const req = http
      .request(schemaUrl, { method: 'get' }, (res) => {
        res.on('data', (chunk) => {
          chunks += chunk;
        });

        res.on('error', (e) => {
          reject(e);
        });

        res.on('end', () => {
          const newHash = hash(chunks);

          if (res.statusCode != 200) {
            reject(chunks);
          } else {
            if (newHash === oldHash) {
              resolve({
                jsonDocString: chunks,
                hasModified: false,
              });
            } else {
              sys.writeFile(relHashPath, newHash);

              resolve({
                jsonDocString: chunks,
                hasModified: true,
              });
            }
          }
        });
      })
      .end();

    req.on('error', (e) => {
      reject(e);
    });
  });
};

/**
 *
 * @param {import('umi').IApi} api
 */
export default function clients(api) {
  // describe plugin config
  api.describe({
    key: Key,
    config: {
      default: undefined,
      schema(joi) {
        return joi.array().items(
          joi.object().keys({
            requestLib: joi.object().keys({
              importSource: joi.string(),
              requestMethod: joi.string(),
              namedExports: joi.boolean().optional(),
            }),
            schema: joi.string(),
            clientName: joi.string(),
            gen: joi.any()
          }),
        );
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.register({
    key: Key,
    async fn() {
      /**
       * @type {ClientItem[]}
       */
      const clientsDefinitions = api.config[Key];
      const gen = api.config[Key].gen;

      for await (const client of clientsDefinitions) {
        const { schema, requestLib, clientName } = client;
        await gotAndCompare(
          schema,
          resolve(
            api.cwd, //
            `src/services`,
            clientName,
          ),
        )
          .then(({ jsonDocString, hasModified }) => {
            if (hasModified) {
              gen(
                JSON.parse(jsonDocString),
                resolve(
                  api.cwd, //
                  `src/services`,
                  clientName,
                  'index.ts',
                ),
                {
                  ...requestLib,
                  extraLeadingComments: {
                    Date: new Date().toString(),
                  },
                },
              );
            } else {
              console.log(
                `${clientName} swagger doc not modified since last time, skip generation`,
              );
            }
          })
          .catch((e) => {
            console.log(e);
            // Don't throw continue to build
          });
      }
    },
  });

  // Generating clients onStart
  api.onStart(async function onStart({ args, name }) {
    console.log(`Generate clients under ${name} command`);

    await api.applyPlugins({
      key: Key,
      type: api.ApplyPluginsType.add,
    });
  });

  // Add gen command
  api.registerCommand({
    name: Key,
    description: `Generating clients source code according to your configuration`,
    details: `Add ${Key} field in .umirc.js or .umirc.ts`,
    async fn() {
      // TODO: command 的执行会自动触发 onStart 事件。。。
      // await api.applyPlugins({
      //   key: Key,
      //   type: api.ApplyPluginsType.add,
      // });
    },
  });
}

