/**
 * 
 * @param targetDomain 
 * @returns The corret domain for the template in case of local development
 * Supported templates domains as next:
 * - hychart-demo.bcrumbs.net
 * 
 */
export function checkIfKnownDomain(targetDomain: string) {
  if (
    !targetDomain ||
    targetDomain.indexOf('localhost') >= 0 ||
    targetDomain.indexOf('bc-hychart') >= 0 ||
    targetDomain.indexOf('test.bcrumbs.net') >= 0 ||
    targetDomain.indexOf('test-hychart.bcrumbs.net') >= 0
  ) {
    return 'hychart-demo.bcrumbs.net';
  }

  return targetDomain;
}
