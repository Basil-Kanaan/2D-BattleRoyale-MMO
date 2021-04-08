#!/bin/bash
# -------------------------------------------------------------------------
# Here is what we did to set this all up...
rm package*
npm init -y
# npm init creates a package.json
# http://browsenpm.org/package.json
# https://docs.npmjs.com/files/package.json
# Take the defaults here

# We are adding libraries, they will be in our local node_modules

npm install express
npm install pg
npm install react
npm install react-dom
npm install react-router-dom
npm install react-scripts
npm install @material-ui/core
npm install @material-ui/icons
npm install @material-ui/lab
npm install formik
npm install web-vitals
npm install yup

# check out the package.json now
# check out node_modules

psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f ./src/pages/Game/db/schema.sql
