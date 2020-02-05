'use strict';
module.exports = (sequelize, DataTypes) => {
  const bucketlist = sequelize.define('bucketlist', {
    user_id: DataTypes.INTEGER,
    stadiums_id: DataTypes.INTEGER
  }, {});
  bucketlist.associate = function(models) {
    
    
  };
  return bucketlist;
};