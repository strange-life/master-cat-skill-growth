/**
 * log 片段
 */
interface Section {
  /**
   * 玩家名
   */
  name: string;
  /**
   * 日期
   */
  date: string;
  /**
   * 内容
   */
  content: string;
}

/**
 * log 字典
 * key 为玩家名
 */
type Dict = Record<string, Section[]>;

const regSection =
  /(\S+)\s(\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2})\r\n\s+(.*?)\s*\r\n/g;

function parse(logs: string) {
  const dict: Dict = {};
  let section: RegExpExecArray | null = null;

  while ((section = regSection.exec(logs))) {
    const [, name, date, content] = section;
    if (!dict[name]) dict[name] = [];

    dict[name].push({ name, date, content });
  }

  return dict;
}

export default parse;
