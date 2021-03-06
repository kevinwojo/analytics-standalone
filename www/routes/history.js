require('dotenv').config();
var express = require('express');
var router = express.Router();
var fs = require('fs');
var CSV = require('csv-string');

router.get('/history',function(req,res,next){
	var directory = {
						"GraphQL":
							{"twitter-Tweet":{},
							"twitter-User":{},
							"twitter-Stream":{}},
						"ML":
							{
								//"feature":{},
							"clustering":{}},
						"NLP":
							{"preprocessing":{},
							"sentiment":{}
							//"topic-modeling":{}
							},
						"NW":{"networkx":{}},
					}
					
	if (fs.existsSync(process.env.ROOTDIR + process.env.DOWNLOAD)){
		if (fs.existsSync(process.env.ROOTDIR + process.env.DOWNLOAD_ML)) {
			if (fs.existsSync(process.env.ROOTDIR + process.env.DOWNLOAD_ML)){
				var fileList = fs.readdirSync(process.env.ROOTDIR + process.env.DOWNLOAD_ML_CLUSTERING)
				for (var i = 0, length = fileList.length; i<length; i++){
					var created_at = fs.lstatSync(process.env.ROOTDIR + process.env.DOWNLOAD_ML_CLUSTERING + '/' + fileList[i]).birthtime.toString();
					directory['ML']['clustering'][fileList[i]] = created_at;
				}
			}
			/*if (fs.existsSync(process.env.ROOTDIR + process.env.DOWNLOAD_ML_TRAINING)){
				var fileList = fs.readdirSync(process.env.ROOTDIR + process.env.DOWNLOAD_ML_TRAINING);
				for (var i = 0, length = fileList.length; i<length; i++){
					var created_at = fs.lstatSync(process.env.ROOTDIR + + process.env.DOWNLOAD_ML_TRAINING + '/' + fileList[i]).birthtime.toString();
					directory['ML']['feature'][fileList[i]] = created_at;
				}
			}*/
		}
		
		if (fs.existsSync(process.env.ROOTDIR + process.env.DOWNLOAD_NLP)){
			if (fs.existsSync(process.env.ROOTDIR +process.env.DOWNLOAD_NLP_PREPROCESSING)){
				var fileList = fs.readdirSync(process.env.ROOTDIR + process.env.DOWNLOAD_NLP_PREPROCESSING);
				for (var i = 0, length = fileList.length; i<length; i++){
					var created_at = fs.lstatSync(process.env.ROOTDIR + process.env.DOWNLOAD_NLP_PREPROCESSING + '/'+ fileList[i]).birthtime.toString();
					directory['NLP']['preprocessing'][fileList[i]] = created_at;
				}
			}
			if (fs.existsSync(process.env.ROOTDIR + process.env.DOWNLOAD_NLP_SENTIMENT)){
				var fileList = fs.readdirSync(process.env.ROOTDIR + process.env.DOWNLOAD_NLP_SENTIMENT);
				for (var i = 0, length = fileList.length; i<length; i++){
					var created_at = fs.lstatSync(process.env.ROOTDIR + process.env.DOWNLOAD_NLP_SENTIMENT + '/' + fileList[i]).birthtime.toString(); 
					directory['NLP']['sentiment'][fileList[i]] = created_at;
				}
			}
			/*if (fs.existsSync(process.env.ROOTDIR + process.env.DOWNLOAD_NLP_TOPIC)){
				var fileList = fs.readdirSync(process.env.ROOTDIR + process.env.DOWNLOAD_NLP_TOPIC);
				for (var i = 0, length = fileList.length; i<length; i++){
					var created_at= fs.lstatSync(process.env.ROOTDIR + process.env.DOWNLOAD_NLP_TOPIC + '/' + fileList[i]).birthtime.toString();
					directory['NLP']['topic-modeling'][fileList[i]] = created_at;
				}
			}*/
		}
		if (fs.existsSync(process.env.ROOTDIR + process.env.DOWNLOAD_NW)){
			if (fs.existsSync(process.env.ROOTDIR + process.env.DOWNLOAD_NW_NETWORKX)){
				var fileList = fs.readdirSync(process.env.ROOTDIR + process.env.DOWNLOAD_NW_NETWORKX);
				for (var i = 0, length = fileList.length; i<length; i++){
					var created_at= fs.lstatSync(process.env.ROOTDIR + process.env.DOWNLOAD_NW_NETWORKX + '/' + fileList[i]).birthtime.toString();
					directory['NW']['networkx'][fileList[i]] = created_at;
				}
			}
		}
		
		if (fs.existsSync(process.env.ROOTDIR + process.env.DOWNLOAD_GRAPHQL)){
			if (fs.existsSync(process.env.ROOTDIR +process.env.DOWNLOAD_GRAPHQL + '/twitter-Tweet')){
				var fileList = fs.readdirSync(process.env.ROOTDIR +process.env.DOWNLOAD_GRAPHQL + '/twitter-Tweet');
				for (var i = 0, length = fileList.length; i<length; i++){
					var created_at= fs.lstatSync(process.env.ROOTDIR + process.env.DOWNLOAD_GRAPHQL + '/twitter-Tweet/' + fileList[i]).birthtime.toString();
					directory['GraphQL']['twitter-Tweet'][fileList[i]] = fileList[i] + ' (' + created_at + ')';
				}
			}
			if (fs.existsSync(process.env.ROOTDIR +process.env.DOWNLOAD_GRAPHQL + '/twitter-User')){
				var fileList = fs.readdirSync(process.env.ROOTDIR +process.env.DOWNLOAD_GRAPHQL + '/twitter-User');
				for (var i = 0, length = fileList.length; i<length; i++){
					var created_at= fs.lstatSync(process.env.ROOTDIR + process.env.DOWNLOAD_GRAPHQL + '/twitter-User/' + fileList[i]).birthtime.toString();
					directory['GraphQL']['twitter-User'][fileList[i]] = fileList[i] + ' (' + created_at + ')';
				}
			}
			if (fs.existsSync(process.env.ROOTDIR +process.env.DOWNLOAD_GRAPHQL + '/twitter-Stream')){
				var fileList = fs.readdirSync(process.env.ROOTDIR +process.env.DOWNLOAD_GRAPHQL + '/twitter-Stream');
				for (var i = 0, length = fileList.length; i<length; i++){
					var created_at= fs.lstatSync(process.env.ROOTDIR + process.env.DOWNLOAD_GRAPHQL + '/twitter-Stream/' + fileList[i]).birthtime.toString();
					directory['GraphQL']['twitter-Stream'][fileList[i]] = fileList[i] + ' (' + created_at + ')';
				}
			}
		}
	}
	res.render('history',{parent:'/', directory: directory});
});

router.post('/history',function(req,res,next){
	
	var DIR = process.env.ROOTDIR + process.env.DOWNLOAD + '/' + req.body.layer1 + '/' + req.body.layer2 +'/' + req.body.historyID;
	
	/*if (req.body.layer2 ==='topic-modeling' 
			&& fs.readdirSync(DIR).length === 4 
			&& fs.existsSync(process.env.ROOTDIR + '/public/pyLDAvis/pyLDAvis-' + req.body.historyID + '.html')){
		var div_features_data = fs.readFileSync(DIR + '/div_features.dat', 'utf8'); 		
		var preview_string = fs.readFileSync(DIR + '/topic.csv', "utf8");
		var preview_arr = CSV.parse(preview_string);
		
		var config = JSON.parse(fs.readFileSync(DIR + '/config.dat','utf8'));
		
		res.send({
			title:'Latent Dirichlet Allocation topic modeling', 
			ID:req.body.historyID,
			img:[{name:'Feature Extraction',content:div_features_data}],
			download:[{name:'Extracted Features', content:DIR + '/tfidf_features.csv'},
						{name:'top 100 words in each Topic',content:DIR + '/topic.csv'}],
			iframe:{name:'pyLDAvis tool',content:'pyLDAvis-' + req.body.historyID + '.html'},
			preview:{name:'Preview Top words in each Topic',content:preview_arr},
			config:config
		});
		
	}*/
	if (req.body.layer2=== 'preprocessing' && fs.readdirSync(DIR).length === 7){
		
		var div_data = fs.readFileSync(DIR +'/div.dat', 'utf8'); 
		var sentence_array = fs.readFileSync(DIR +'/sentence.csv','utf8').toString().split("\n")
		var new_sentence_array = [];
		for (var i = 0, length= sentence_array.length; i<length; i++){
			new_sentence_array.push([sentence_array[i]]) //add [] to make it comply with google word tree requirement
		}
		
		var most_common_array = fs.readFileSync(DIR +'/frequent-rank.csv').toString().split("\n")[1]
		var most_freq_word = most_common_array.split(",")[0]
		
		var config = JSON.parse(fs.readFileSync(DIR + '/config.dat','utf8'));
		
		if (fs.readdirSync(DIR).indexOf('lemmatized.csv') >-1){
			var processed = 'lemmatized';
		}else if (fs.readdirSync(DIR).indexOf('stemmed.csv') >-1){
			var processed = 'stemmed';
		}else if (fs.readdirSync(DIR).indexOf('lemmatized-stemmed.csv') >-1){
			var processed = 'lemmatized-stemmed';
		}
		
		res.send({
			title:'Natural Language PreProcessing', 
			ID:req.body.historyID,
			img:[{name:'Word Distribution',content:div_data}],
			download:[
				{name:'phrases', content:DIR +'/sentence.csv'},
				{name:'words', content:DIR +'/tokenized.csv'},
				{name:'most common words by order', content:DIR +'/frequent-rank.csv'},
				{name: processed + ' text', content:DIR + '/' + processed + '.csv'},
				{name:'POS tagged text', content:DIR +'/POStagged.csv'}],
			table:{name:'word tree', content:new_sentence_array, root:most_freq_word},
			config:config
		});
		
	}
	else if (req.body.layer2 === 'sentiment' && fs.readdirSync(DIR).length === 6){
		
		var div_data = fs.readFileSync(DIR + '/div_sent.dat', 'utf8'); 
		var preview_string = fs.readFileSync(DIR +'/sentiment.csv', "utf8"); 
		var preview_arr = CSV.parse(preview_string);
		
		var compound = JSON.parse(fs.readFileSync(DIR +'/document.json','utf8'))['compound'];
		var config = JSON.parse(fs.readFileSync(DIR + '/config.dat','utf8'));
		res.send({
					title:'Sentiment Analysis',
					ID:req.body.historyID,
					img:[{name:'Document Sentiment Composition',content:div_data}],
					compound:compound,
					download:[{name:'sentence-level sentiment scores',content:DIR +'/sentiment.csv'},
							{name:'Has negation words?',content:DIR +'/negation.csv'},
							{name:'Has some capital letter?',content:DIR +'/allcap.csv'}],
					preview:{name:'Preview the sentiment scores for each sentence',content:preview_arr},
					config:config
				});
	}
	else if (req.body.layer2 === 'clustering'  && fs.readdirSync(DIR).length === 5){
		var div_data = fs.readFileSync(DIR +'/div.dat', 'utf8'); //trailing /r 
		var div_comp_data = fs.readFileSync(DIR + '/div_comp.dat', 'utf8');
		var preview_string = fs.readFileSync(DIR +'/clustering-features.csv', "utf8"); 
		var preview_arr = CSV.parse(preview_string);
		var config = JSON.parse(fs.readFileSync(DIR + '/config.dat','utf8'));
		res.send({
				title:'scikit-learn clustering', 
				ID:req.body.historyID,
				img:[{name:'Clustering down-grade to 2D',content:div_data},
						{name:'Composition of predicted clusters', content:div_comp_data}],
				download:[{name:'Download clustered data', content:DIR + '/clustering-complete.csv'},
						{name:'Download features and clustered label',content:DIR + '/clustering-features.csv'}],
				preview:{name:'preview some of the clustered data',content:preview_arr},
				config:config
			});
	}
	else if (req.body.layer2 === 'networkx' && fs.readdirSync(DIR).length >=5){
		var fnames = fs.readdirSync(DIR);
		var div_data = fs.readFileSync(DIR + '/div.dat', 'utf8');
		var config = JSON.parse(fs.readFileSync(DIR + '/config.dat','utf8'));
		if (fs.existsSync(DIR + '/d3js.json')){
			var d3js_data = JSON.parse(fs.readFileSync(DIR + '/d3js.json','utf8'));
		}else{
			var d3js_data = '';
		}
		
		fnames = fnames.filter(item => item !== 'div.dat' && item !== 'config.dat');
		
		var downloadFiles = [];
		for (var i=0; i< fnames.length; i++){
			if (fnames[i] === 'd3js.json'){
				downloadFiles.push({'name':'graph exported in JSON format', 'content':DIR + '/' + fnames[i]}); 
			}else if (fnames[i] === 'network.gml'){
				downloadFiles.push({'name':'graph exported in GML (Gephi) format', 'content':DIR + '/' + fnames[i]}); 
			}else if (fnames[i] === 'network.net'){
				downloadFiles.push({'name':'graph exported in NET (Pajek) format', 'content':DIR + '/' + fnames[i]}); 
			}else{
				var fnameRegex = /(.*).json/g
				var display_name = fnameRegex.exec(fnames[i])[1];
				downloadFiles.push({'name':display_name + ' metrics', 'content':DIR + '/' + fnames[i]}); 
			}
		}
		
		//console.log(fnames);
		res.send({
			title:'Network Analysis', 
			ID:req.body.historyID,
			img:[{name:'Static Network Visualization',content:div_data}],
			download: downloadFiles,
			config: config,
			d3js_data:d3js_data
		});
	}
	else if ((
				req.body.layer2 === 'twitter-Tweet' ||
				req.body.layer2 === 'twitter-User' ||
				req.body.layer2 === 'twitter-Stream' ) && fs.readdirSync(DIR).length ==3){
		var config = JSON.parse(fs.readFileSync(DIR  + '/' + req.body.historyID + '.dat','utf8'));
		var preview_string = fs.readFileSync(DIR + '/' + req.body.historyID + '.csv', "utf8"); 
		var preview_arr = CSV.parse(preview_string);
		config.fields = preview_arr[0];
		
		res.send({
				title:'Social Media Past Search Result', 
				ID:req.body.historyID,
				download:[
					{name:'JSON format', content: DIR + '/' + req.body.historyID + '.json'},
					{name:'CSV format', content: DIR + '/' + req.body.historyID + '.csv'}],
				preview:{name: "Preview the .csv file", content:preview_arr.slice(0,101)},
				config:config
			});
	}
	else{
		res.send({ERROR:`Sorry! We cannot find specific analytic history associated with this ID`});
	}

});

router.post('/delete',function(req,res,next){
	if (req.body.type === 'analytics'){
		var DIR = process.env.ROOTDIR + process.env.DOWNLOAD + '/' + req.body.layer1 + '/' + req.body.layer2 +'/' + req.body.historyID;
		deleteFolderRecursive(DIR);
		res.send('Successfully deleted!');
	}
	
	else if (req.body.type === 'graphql'){
		
		var DIR_GraphQL = process.env.ROOTDIR + process.env.DOWNLOAD_GRAPHQL + '/' + req.body.historyID;
		if (fs.existsSync(DIR_GraphQL + '.json')){
			fs.unlinkSync(DIR_GraphQL + '.json');
		}
		if (fs.existsSync(DIR_GraphQL + '.csv')){
			fs.unlinkSync(DIR_GraphQL + '.csv');
		}
		if (fs.existsSync(DIR_GraphQL + '.dat')){
			fs.unlinkSync(DIR_GraphQL + '.dat');
		}
		if (fs.existsSync(DIR_GraphQL + '.zip')){
			fs.unlinkSync(DIR_GraphQL + '.zip');
		}
		res.send('Successfully deleted!');
		
	}
});

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = router;