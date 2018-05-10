'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var productsCtrlStub = {
  index: 'productsCtrl.index',
  show: 'productsCtrl.show',
  create: 'productsCtrl.create',
  upsert: 'productsCtrl.upsert',
  patch: 'productsCtrl.patch',
  destroy: 'productsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var productsIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './products.controller': productsCtrlStub
});

describe('Products API Router:', function() {
  it('should return an express router instance', function() {
    productsIndex.should.equal(routerStub);
  });

  describe('GET /api/products', function() {
    it('should route to products.controller.index', function() {
      routerStub.get
        .withArgs('/', 'productsCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/products/:id', function() {
    it('should route to products.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'productsCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/products', function() {
    it('should route to products.controller.create', function() {
      routerStub.post
        .withArgs('/', 'productsCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/products/:id', function() {
    it('should route to products.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'productsCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/products/:id', function() {
    it('should route to products.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'productsCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/products/:id', function() {
    it('should route to products.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'productsCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
