'use strict';
const db = require('@arangodb').db;
const collectionName = 'ciqd-model';

if (!db._collection(collectionName)) {
  db._createDocumentCollection(collectionName);
}
