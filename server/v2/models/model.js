
import db from './db';
import GeneralHelper from '../helpers/general';
import DbHelper from '../helpers/db_Helper';

const { removeUnexpect } = GeneralHelper;
const { prepareData, removeDataToHide } = DbHelper;

class Model {
  constructor(table) {
    this.data = [];
    this.query = {};
    this.db = db;
  }

  async create(itemToCreate) {
    const item = removeUnexpect(this.known_attributes, itemToCreate);

    const {
      prepare_columns,
      prepare_values,
      values,
    } = prepareData(item);

    this.query = {
      text: `INSERT INTO ${this.table} (${prepare_columns}) values(${prepare_values}) RETURNING*`,
      values,
    };


    const { rows: [created_data] } = await db.query(this.query);

    return created_data;
  }

  async all() {
    this.query = {
      text: `SELECT * FROM ${this.table}`,
      values: [],
    };
    const { rows } = await db.query(this.query);


    return rows;
  }

  async find(itemId) {
    this.query = {
      text: `SELECT * FROM ${this.table} WHERE id=$1 `,
      values: [itemId],
    };
    const { rows: [first_user] } = await db.query(this.query);


    return first_user;
  }


  async findWhere(key, value) {
    this.query = {
      text: `SELECT * FROM ${this.table} WHERE ${key}=$1 `,
      values: [value],
    };

    const { rows } = await db.query(this.query);

    return rows;
  }
}

export default Model;
