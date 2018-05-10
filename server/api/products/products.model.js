'use strict';

import mongoose from 'mongoose';
import {registerEvents} from './products.events';

var ProductsSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

registerEvents(ProductsSchema);
export default mongoose.model('Products', ProductsSchema);
