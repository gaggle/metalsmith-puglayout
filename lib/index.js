"use strict";
const each = require("metalsmith-each")
const globallyDefine = require("metalsmith-define")
const layouts = require("metalsmith-layouts")
const Resolver = require("metalsmith-plugin-resolver")
const path = require("path")

const plugin = function (opts) {
  const globals = objpop(opts, "globals")
  opts = Object.assign({}, opts, {engine: "pug"})
  if (needsPugExt(opts.default))
    opts.default = opts.default + ".pug"

  return function (files, metalsmith, done) {
    const resolver = new Resolver(files, metalsmith)

    resolver
      .use(globallyDefine(globals))
      .use(each(file => {
        if (needsPugExt(file.layout))
          file.layout = file.layout + ".pug"
      }))
      .use(layouts(opts))
      .run(done)
  }
}

module.exports = plugin

const objpop = function (obj, key) {
  const val = obj[key]
  delete obj[key]
  return val
}

const needsPugExt = function (prop) {
  if (!prop)
    return false
  if (path.extname(prop) === ".pug")
    return false
  return true
}
