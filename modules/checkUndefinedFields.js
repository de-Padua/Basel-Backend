function checkUndefinedFields(fieldsFromRequest, fields) {
  let undefinedField = false
  for (let i = 0; i < fields.length; i++) {
    if (fieldsFromRequest[fields[i]] === undefined) {
      undefinedField = true;
    }
   
  }
return undefinedField
}

module.exports = checkUndefinedFields;
