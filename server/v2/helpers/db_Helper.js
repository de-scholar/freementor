

class DbHelper {
  static prepareData(data) {
    const keys = Object.keys(data);
    const prepare_columns = keys.toString();
    const prepare_values = keys.map((col, index)=> `$${index + 1}`).toString();
    const values = Object.values(data);
    const prepare_edit_columns = keys.map((col, index)=> `${col}=$${index + 1}`).toString();

    return {
      keys,
      prepare_columns,
      prepare_values,
      prepare_edit_columns,
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

