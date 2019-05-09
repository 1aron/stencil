import * as d from '../../declarations';
import { setBooleanConfig, setStringConfig } from './config-utils';
import { validatePrerender } from './validate-prerender';
import { validateResourcesUrl } from './validate-resources-url';
import { validateServiceWorker } from './validate-service-worker';
import { validateCopy } from './validate-copy';
import { DIST_GLOBAL_STYLES, DIST_LAZY, WWW, isOutputTargetWww } from '../output-targets/output-utils';


export function validateOutputTargetWww(config: d.Config) {
  const hasOutputTargets = Array.isArray(config.outputTargets);
  const hasE2eTests = !!(config.flags && config.flags.e2e);

  if (!hasOutputTargets || (hasE2eTests && !config.outputTargets.some(isOutputTargetWww))) {
    config.outputTargets = [
      { type: WWW }
    ];
  }

  const wwwOutputTargets = config.outputTargets.filter(isOutputTargetWww);
  wwwOutputTargets.forEach(outputTarget => {
    validateOutputTarget(config, outputTarget);
  });
}


function validateOutputTarget(config: d.Config, outputTarget: d.OutputTargetWww) {
  const path = config.sys.path;

  setStringConfig(outputTarget, 'baseUrl', '/');
  setStringConfig(outputTarget, 'dir', DEFAULT_DIR);

  if (!path.isAbsolute(outputTarget.dir)) {
    outputTarget.dir = path.join(config.rootDir, outputTarget.dir);
  }

  setStringConfig(outputTarget, 'buildDir', DEFAULT_BUILD_DIR);

  if (!path.isAbsolute(outputTarget.buildDir)) {
    outputTarget.buildDir = path.join(outputTarget.dir, outputTarget.buildDir);
  }

  setStringConfig(outputTarget, 'indexHtml', DEFAULT_INDEX_HTML);

  if (!path.isAbsolute(outputTarget.indexHtml)) {
    outputTarget.indexHtml = path.join(outputTarget.dir, outputTarget.indexHtml);
  }

  setBooleanConfig(outputTarget, 'empty', null, DEFAULT_EMPTY_DIR);
  validatePrerender(config, outputTarget);

  outputTarget.copy = validateCopy(outputTarget.copy, [
    ...(config.copy || []),
    ...DEFAULT_WWW_COPY,
  ]);

  outputTarget.resourcesUrl = validateResourcesUrl(outputTarget.resourcesUrl);
  validateServiceWorker(config, outputTarget);

  if (outputTarget.polyfills === undefined) {
    outputTarget.polyfills = true;
  }
  outputTarget.polyfills = !!outputTarget.polyfills;

  // Add dist-lazy output target
  const buildDir = outputTarget.buildDir;
  config.outputTargets.push({
    type: DIST_LAZY,
    copyDir: buildDir,
    esmDir: buildDir,
    systemDir: buildDir,
    polyfills: outputTarget.polyfills,
    systemLoaderFile: config.sys.path.join(buildDir, `${config.fsNamespace}.js`),
    isBrowserBuild: true,
  });

  // Generate global style with original name
  config.outputTargets.push({
    type: DIST_GLOBAL_STYLES,
    file: config.sys.path.join(buildDir, `${config.fsNamespace}.css`),
  });
}


const DEFAULT_WWW_COPY = [
  { src: 'assets', warn: false },
  { src: 'manifest.json', warn: false }
];
const DEFAULT_DIR = 'www';
const DEFAULT_INDEX_HTML = 'index.html';
const DEFAULT_BUILD_DIR = 'build';
const DEFAULT_EMPTY_DIR = true;
