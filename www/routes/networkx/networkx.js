require('dotenv').config();
var express = require('express');
var router = express.Router();
var fs = require('fs');
var pythonShell = require('python-shell');
var CSV = require('csv-string');
var path = require('path');
var appPath = path.resolve('.');
var readDIR = require(appPath + '/scripts/helper.js').readDIR;

router.get('/networkx',function(req,res,next){
	var files = readDIR(process.env.ROOTDIR + process.env.DOWNLOAD_GRAPHQL);
	delete files['twitter-User'];
	var formParam = require('./networkx.json');
	res.render('analytics/formTemplate',{parent:'/#Network Analysis', title:'NetworkX', directory:files, param:formParam}); 
});

router.post('/networkx',function(req,res,next){
	var options = {
		pythonPath:process.env.PYTHONPATH,
		scriptPath:appPath + '/scripts/NetworkX/',
		args:[	'--file',process.env.ROOTDIR + process.env.DOWNLOAD_GRAPHQL + '/'+   req.body.filename, 
				'--layout',req.body.layout, 
				'--relations',req.body.relations, 
				'--prune',req.body.prune
				//'--node_size',req.body.node_size,
				//'--edge_width',req.body.edge_width 
			] 
	};
	
	pythonShell.run('network_analysis.py',options,function(err,results){
		if (err){
			throw err;
			//res.send({'ERROR':err});
		}else{
			
			var d3js = results[1];
			var gephi = results[2];
			var pajek = results[3];
			var div= results[4];
			var downloadFiles = [	{'name':'graph exported in GML (Gephi) format', 'content':gephi},
									{'name':'graph exported in JSON format', 'content':d3js},
									{'name':'graph exported in net (Pajek) format', 'content':pajek}
									];
			
			for (var j=5; j< results.length; j++){
				var fnameRegex = /\/(?=[^\/]*$)(.*).json/g;
				var display_name = fnameRegex.exec(results[j])[1];
				downloadFiles.push({'name':display_name + ' metrics', 'content':results[j]});
			}				
			
			
			if (d3js.slice(-1)=== '\r' || d3js.slice(-1) === '\n' || d3js.slice(-1) === '\t' || d3js.slice(-1) === '\0' || d3js.slice(-1) === ' '){
				var d3js_data = JSON.parse(fs.readFileSync(d3js.slice(0,-1),'utf8'));
			}else{
				var d3js_data = JSON.parse(fs.readFileSync(d3js,'utf8'));
			}
			
			
			if (div.slice(-1) === '\r' || div.slice(-1) === '\n' || div.slice(-1) === '\t' || div.slice(-1) === '\0' || div.slice(-1) === ' '){
				var div_data = fs.readFileSync(div.slice(0,-1), 'utf8'); //trailing /r
			}else{
				var div_data = fs.readFileSync(div, 'utf8'); //trailing /r
			}
			
			res.send({
				title:'Network Analysis', 
				img:[{name:'Static Network Visualization',content:div_data}],
				download: downloadFiles,
				metrics:{name:'', content:''}, 
				preview:{name:'',content:''},
				d3js_data:d3js_data
			});
			
		}
	});
	
});
      
module.exports = router;