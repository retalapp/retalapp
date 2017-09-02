const retalapp = require('../src/index');
const path = require('path');
const should = require('chai').should();

describe('retalapp setteable packages', () => {

  before(() => {
    retalapp.alias('#modules', path.join(__dirname, '..', 'modules'));
  })

  it('alias', () => {
    retalapp.app('example', '#modules/example');
    require('example').param1.should.be.equal('param1 default');
  })

  it('default params', () => {
    const paramExpectDefault = {
      param1: 'param1 default',
      param2: 'param2 default'
    };

    retalapp.app('example', '#modules/example');
    require('example').param1.should.be.equal(paramExpectDefault.param1);
    require('example').param2.should.be.equal(paramExpectDefault.param2);
    require('example').param3.should.be.equal(paramExpectDefault.param1+paramExpectDefault.param2);
  })

  it('setting params', () => {
    const paramExpect = {
      param1: 'param1-mofified default',
      param2: 'param2-mofified default'
    };

    retalapp.app('example', '#modules/example', paramExpect);
    require('example').param1.should.be.equal(paramExpect.param1);
    require('example').param2.should.be.equal(paramExpect.param2);
    require('example').param3.should.be.equal(paramExpect.param1+paramExpect.param2);
  })

  it('setting runtime params', () => {
    const paramExpectRuntime = {
      param1: 'param1-mofified default runtime',
      param2: 'param2-mofified default runtime'
    };

    retalapp.app('example1', '#modules/example');
    require(['example1', paramExpectRuntime]).param1.should.be.equal(paramExpectRuntime.param1);
    require(['example1', paramExpectRuntime]).param2.should.be.equal(paramExpectRuntime.param2);
    require(['example1', paramExpectRuntime]).param3.should.be.equal(paramExpectRuntime.param1+paramExpectRuntime.param2);
  })

  it('requiring normal packages', () => {
    const express = require('express');
    express.should.be.a('function');
  })

})