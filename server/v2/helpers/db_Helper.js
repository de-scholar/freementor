

class DbHelper {
  static prepareData(data) {
    const keys = Object.keys(data);
    const prepare_columns = keys.toString();
    const prepare_values = keys.map((col, index)=> `$${index + 1}`);
    const values = Object.values(data);

    return {
      keys,
      prepare_columns,
      prepare_values,
      values,
    };
  }

  static isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
  }

  static removeDataToHide(data, toHide) {
    if (toHide.length === 0) return data;

    if (DbHelper.isArray(data)) {
      return data.map((item)=> {
        Object.keys(item).map((key)=> (toHide.includes(key) ? delete item[key] : key));
        return item;
      });
    }
    Object.keys(data)
      .map((key)=> (toHide.includes(key) ? delete data[key] : key));
    return data;
  }
}

export default DbHelper;

