'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const db=require('@arangodb').db;
const errors=require('@arangodb').errors;
const foxxColl=db._collection('ciqd-model');
const DOC_NOT_FOUND=errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const joi = require('joi');
const aql = require('@arangodb').aql;

module.context.use(router);

// Store entry in a collection

router.post('/entries', function(req,res) {
  const data=req.body;
  const meta = foxxColl.save(req.body);
  res.send(Object.assign(data,meta));
})

.body (joi.object().required(), 'Entry to store in the collection')
.response(joi.object().required(), 'Entry Stored in the collection')
.summary('Store an entry')
.description('Stores an entry in "ciqd-model" collection.')

// Query document with Key

router.get('/entries/:key', function (req, res) {
  try {
    const data = foxxColl.document(req.pathParams.key);
    res.send(data)
  } catch (e) {
    if (!e.isArangoError || e.errorNum !== DOC_NOT_FOUND) {
      throw e;
    }
    res.throw(404, 'The entry does not exist', e);
  }
})
.pathParam('key', joi.string().required(), 'Key of the entry.')
.response(joi.object().required(), 'Entry stored in the collection.')
.summary('Retrieve an entry')
.description('Retrieves an entry from the "ciqd-model" collection by key.');

// Query document with aql

router.get('/entries', function(req,res) {
  const keys = db._query(aql`FOR entry IN ${foxxColl} RETURN entry._key`);
  res.send(keys);
})

.response(joi.array().items(
  joi.string().required()
).required(), 'List of entry keys.')
.summary('List entry keys')
.description('Assembles a list of keys of entries in the collection.');
