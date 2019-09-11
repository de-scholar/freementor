import moment from 'moment';

const { NODE_ENV } = process.env;

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

  static format_date(date) {
    return moment(date).format('DD/MM/YYYY');
  }

  static isArray(value) {
    return value && typeof value === 'object' && value.constructor === Array;
  }

  static arrange_date(data, dateToFormat = ['created_at']) {
    if (!data) return data;

    if (DbHelper.isArray(data)) {
      return data.map((item)=> {
        dateToFormat.map((date)=> {
          if (item[date]) {
            item[date] = DbHelper.format_date(item[date]);
          }
          return date;
        });
        return item;
      });
    }
    dateToFormat.map((item)=> {
      if (data[item]) {
        data[item] = DbHelper.format_date(data[item]);
      }
      return item;
    });
    return data;
  }

  static change_forArray(data, attributes) {
    return data.map((item)=> {
      Object.keys(attributes).map((attrToReplace)=> {
        if (item[attrToReplace]) {
          const replaceWith = attributes[attrToReplace];

          item[replaceWith] = item[attrToReplace];
          if (NODE_ENV !== 'test') { delete item[attrToReplace]; }
        }
        return attrToReplace;
      });
      return item;
    });
  }

  static change_attribute(data, attributes) {
    if (!data) return data;

    if (DbHelper.isArray(data)) {
      return DbHelper.change_forArray(data, attributes);
    }

    Object.keys(attributes).map((attrToReplace)=> {
      if (data[attrToReplace]) {
        const replaceWith = attributes[attrToReplace];

        data[replaceWith] = data[attrToReplace];
        if (NODE_ENV !== 'test') { delete data[attrToReplace]; }
      }
      return attrToReplace;
    });
    return data;
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

