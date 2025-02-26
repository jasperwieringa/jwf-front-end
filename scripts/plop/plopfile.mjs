/*
This file is used to run a set of actions when running the `npm run create` script.
Each action in the setGenerator method adds or modifies a file.
The current actions include:
 - Adding a web-component (templates/component.hbs)
 - Adding a web-component registry, following the open-web approach (templates/registry.hbs)
 - Adding a style file (templates/styles.hbs)
 - Add import statement to the index.ts file (src/index.ts)
*/
export default function (plop) {
  plop.setHelper('tagWithoutPrefix', tag => tag.replace(/^jwf-/, ''));

  plop.setHelper('tagToTitle', tag => {
    const withoutPrefix = plop.getHelper('tagWithoutPrefix');
    const titleCase = plop.getHelper('titleCase');
    return titleCase(withoutPrefix(tag));
  });

  plop.setGenerator('component', {
    description: 'Generate a new JWF web-component',
    prompts: [
      {
        type: 'input',
        name: 'tag',
        message: 'Tag name? (e.g. jwf-button)',
        validate: value => {
          // Start with jwf- and include only a-z + dashes
          if (!/^jwf-[a-z-+]+/.test(value)) {
            return false;
          }

          // No double dashes or ending dash
          return !(value.includes('--') || value.endsWith('-'));
        }
      }
    ],
    actions: [
      {
        type: 'add',
        path: '../../src/components/{{ tagWithoutPrefix tag }}/{{ properCase tag }}.ts',
        templateFile: './templates/component.hbs'
      },
      {
        type: 'add',
        path: '../../src/components/{{ tagWithoutPrefix tag }}/{{ tag }}.ts',
        templateFile: './templates/registry.hbs'
      },
      {
        type: 'add',
        path: '../../src/components/{{ tagWithoutPrefix tag }}/{{ tag }}.styles.ts',
        templateFile: './templates/styles.hbs'
      },
      {
        type: 'modify',
        path: '../../src/index.ts',
        pattern: /\/\* plop:component-import \*\//,
        template: `import './components/{{ tagWithoutPrefix tag }}/{{ tag }}.js';\n/* plop:component-import */`
      },
    ]
  });
};
