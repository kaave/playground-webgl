/*
 * 機能面で絞り込みたい際にはModernizrなどをつかうよーに
 * https://modernizr.com/
 * 一応IE8だの7だのも書いてあるけどそもそもwebpackがまともに動かないので意味ないよ
 */

const { userAgent } = navigator;

export default function(): string[] {
  const classNames: string[] = [];

  if (/iPhone|iPod|iPad/.test(userAgent)) {
    classNames.push('-ios');

    const matcher = userAgent.match(/OS (\d{1,2}_\d)/);

    if (matcher) {
      const [major, minor] = matcher[1].split('_').map(num => parseInt(num, 10));

      if (major >= 10) {
        classNames.push('-ios--play-video');

        if (minor >= 3) {
          classNames.push('-ios--grid-layout');
        }
      }
    }
  } else if (/Android/.test(userAgent)) {
    classNames.push('-android');
  } else if (/rv:11\.0/.test(userAgent)) {
    classNames.push('-ie', '-ie--11');
  } else if (/MSIE 10\.0/.test(userAgent)) {
    classNames.push('-ie', '-ie--10', '-ie--not-supported');
  } else if (/MSIE 9\.0/.test(userAgent)) {
    classNames.push('-ie', '-ie--9', '-ie--not-supported');
  } else if (/MSIE 8\.0/.test(userAgent)) {
    classNames.push('-ie', '-ie--8', '-ie--not-supported');
  } else if (/MSIE 7\.0/.test(userAgent)) {
    classNames.push('-ie', '-ie--7', '-ie--not-supported');
  }

  return classNames;
}
