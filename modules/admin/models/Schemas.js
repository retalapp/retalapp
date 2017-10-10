const vermongo = require('mongoose-vermongo');
const typeList = ['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'Objectid', 'Array'];

module.exports = ($module) => {
  const Schema   = $module.adapter.Schema;
  const schemasSchema = new Schema({
    id: {
      type: Schema.Types.ObjectId,
      ref: '{ref}'
    },
    name: {
    	type: String,
    	required: true,
    	trim: true
    },
    name_code: {
    	type: String,
    	required: true,
    	trim: true
    },
    description: {
    	type: String,
    	required: true,
    	trim: true
    },
    fields: [{
	    id: {
	      type: Schema.Types.ObjectId,
	      ref: '{ref}'
	    },
	    label: {
	    	type: String,
	    	required: true,
	    	trim: true
	    },
	    name_code: {
	    	type: String,
	    	required: true,
	    	trim: true
	    },
	    help_text: {
	    	type: String,
	    	required: false,
	    	trim: true
	    },
	    field_type: {
	    	type: String,
	    	required: true,
	    	trim: true,
	    	enum: typeList,
	    },
	    field_widget: {
	    	type: String,
	    	required: false,
	    	trim: true
	    },
	    is_required: {
	    	type: Boolean
	    },
	    validations: [{
	    	name: {
		    	type: String,
		    	required: true,
		    	trim: true
		    },
	    	source: {
		    	type: String,
		    	required: true,
		    	trim: true
		    }
	    }],
    	parent: {
	      type: Schema.Types.ObjectId,
	      ref: '{ref}'
	    },
	    order: {
	    	type: Number,
	    	required: true,
	    	trim: true
	    },
	    version: {
	    	type: String,
	    	required: true,
	    	trim: true
	    }
    }],
  },{ 
    'timestamps': { 
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  });

  schemasSchema.statics.search = function(params) {
    return new Promise((resolve, reject) => {
	  	const page = parseInt(params.page) || 1;
	    const by = params.by || 'created_at';
	    const sort = params.sort || 'desc';

	    let perPage = require('pag').perPage;
	    let paging = {};
	    let select = {};
	    let criteria = {};

	    if(params.perPage || params.perPage === 'all') {
	      perPage = params.perPage === 'all' ? false : parseInt(params.perPage)
	    }

	    if(params.fields) {
	      select = params.fields.replace(/,/g, ' ')
	    }

	    if(params.id && $module.adapter.Types.ObjectId.isValid(params.id)) {
	      criteria._id = params.id
	    }

	    if(params.name) {
	      criteria.name = { $regex: params.name, $options: 'i' }
	    }

	    if(params.description) {
	      criteria.description = { $regex: params.description, $options: 'i' }
	    }

	    if(params.q) {
	      criteria.$or = []
	      if($module.adapter.Types.ObjectId.isValid(params.id)) {
	        criteria.$or.push({ _id: params.q })
	      }
	      criteria.$or.push({ name: { $regex: params.q, $options: 'i' }})
	      criteria.$or.push({ description: { $regex: params.q, $options: 'i' }})
	    }

    	this
    	.find(criteria)
      .select(select)
      .limit(perPage)
      .skip(perPage * (page - 1))
      .sort([[by, sort]])
      .exec((err, model) => {
      	if (err) {
      		return reject(err);
      	}

      	this
	        .count(criteria)
	        .exec((err, total) => {
        		if (err) {
	        		return reject(err);
	        	}

	          let pages = Math.ceil(total / perPage)
	          let paging = { page, pages, perPage, total}

	          return resolve({model, paging});
	        });
      });
    });
  };

  schemasSchema
	.virtual('slug')
	.get(function() {
	  return this._id + '-' + this.name_code;
	});
	
	schemasSchema.plugin(vermongo, "squemas.history");  
  return $module.adapter.model('Squemas', schemasSchema);
}
