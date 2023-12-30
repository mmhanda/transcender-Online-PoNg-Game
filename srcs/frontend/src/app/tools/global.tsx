
import moment from 'moment';

export const Localhost = () => {
  return process?.env?.NEXT_PUBLIC_LOCALHOST;
}

export function copyToClipboard(text: string) {
  var textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    var successful = document.execCommand('copy');
  } catch (err) {}

  document.body.removeChild(textarea);
}

export const default_img = (avatar:string | undefined | null, fullname:string | undefined | null, bg:string = 'E06E60', color:string = 'fff', font_size:string = "0.4") => {
    let length = 2;
    if (fullname != undefined && fullname != null && fullname.startsWith("%2B"))
    {
      length = 3;
      const N = fullname.substr(3);
      if (N != undefined && N != null && N.length >= 3)
        fullname = "%2B" + 99;
    }
    if (avatar != undefined && avatar != null  && avatar.replace(/\s/g,'').length > 0)
    {
      let uri = avatar;
      if (!avatar.startsWith('http:') && !avatar.startsWith('https:') && !avatar.startsWith('blob:'))
        uri = Localhost() + '/' + avatar;
      return uri;
    }
    if (fullname == undefined || fullname == null || fullname.replace(/\s/g,'') == '')
      return 'https://ui-avatars.com/api/?font-size=' + font_size + '&background='+bg+'&bold=true&color='+color+'&size=128&name=%20';
    return 'https://ui-avatars.com/api/?length='+length+'&font-size=' + font_size + '&background='+bg+'&bold=true&color='+color+'&size=128&name='+ fullname;
}

export const formatRelativeDate = (date: string) => {
  const now = moment();
  const diff = moment.duration(now.diff(date));

  if (diff.asSeconds() < 10) {
    return 'now';
  } else if (diff.asMinutes() < 1) {
    return Math.floor(diff.asSeconds()) + 's';
  } else if (diff.asHours() < 1) {
    return Math.floor(diff.asMinutes()) + 'm';
  } else if (diff.asDays() < 1) {
    return Math.floor(diff.asHours()) + 'h';
  } else if (diff.asMonths() < 1) {
    return Math.floor(diff.asDays()) + 'd';
  } else if (diff.asYears() < 1) {
    return Math.floor(diff.asMonths()) + 'mo';
  } else {
    return Math.floor(diff.asYears()) + 'y';
  }
}

export const inMessageformatRelativeDate = (date: string) => {
  return moment(date).format('LT');
}

export const inMessageDate = (dateString: string) => {
  const date = moment(dateString);
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');
  const thisWeekStart = moment().startOf('week');

  if (date.isSame(today, 'day')) {
    return 'today';
  } else if (date.isSame(yesterday, 'day')) {
    return 'yesterday';
  } else if (date.isSameOrAfter(thisWeekStart)) {
    return date.format('dddd'); // day name like Monday
  } else {
    return date.format('YYYY-MM-DD');
  }
}

export const rankString = (rank: number | undefined | null) => {
  if (rank == undefined || rank == null || rank >= 1000)
    return "Unranked";
  if (rank == 1)
    return "1st";
  if (rank == 2)
    return "2nd";
  if (rank == 3)
    return "3rd";
  if (rank <= 10)
    return "Top 10";
  if (rank <= 25)
    return "Top 25";
  if (rank <= 50)
    return "Top 50";
  if (rank <= 100)
    return "Top 100";
  return rank + "th";
}

export const simpleDate = (date: string | undefined) => {
  return moment(date).format('YYYY-MM-DD');
}