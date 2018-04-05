var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});


module.exports.sts = function(id_token,roleARN){	
	AWS.config.credentials = new AWS.WebIdentityCredentials({
	  RoleArn: roleARN,
	  WebIdentityToken: id_token, 
	  RoleSessionName: 'web',
	  DurationSeconds: 3600
	}, {	  
	  httpOptions: {
	    timeout: 100
	  }
	});	
	return "success";
};

module.exports.refreshSTS = function(){
	// boolean isRefresh = AWS.config.credentials.needsRefresh();
	// console.log("refresh", isRefresh);
};

module.exports.cloudWatch = function (){    
    var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});
    var params = {	
        MetricName: 'CPUUtilization',
        Namespace: 'AWS/EC2'
    };
    cw.listMetrics(params, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Metrics", JSON.stringify(data.Metrics));
        var statParams = data.Metrics[0];
        var date = new Date();
        var startTime = date.setMinutes(date.getMinutes()-5);
        console.log("start time", new Date(startTime));
		console.log("end time", new Date());
        statParams['StartTime'] = new Date(startTime);
        statParams['EndTime'] = new Date();
        statParams['Period'] = 60;
        statParams['Statistics'] = ['Maximum','Minimum'];
		console.log("Stat Params", statParams);
        cw.getMetricStatistics(statParams, function(err1, data1) {
          if (err1){
			console.log(err1, err1.stack); 
			}
          else{
			console.log("Statistics", data1); 
			}
        });
      }
    });    
};

module.exports.listInstances = function(){
	var ec2 = new AWS.EC2();
	var params = {		
		Filters: [		
		{
			Name: 'instance-state-name',
			Values: ['running']
		}		
		]				
	};
	ec2.describeInstances(params, function(err, data) {
	  if (err) console.log(err, err.stack); // an error occurred
	  else   {
		console.log(data);           // successful response
		return data;
	  }
	});
};

module.exports.stopInstances = function(listOfInstances) {
	var ec2 = new AWS.EC2();
	var params = {
		InstanceIds:listOfInstances,		
		Force:false
	}
	ec2.stopInstances(params, function(err, data){
		if (err) console.log(err, err.stack); // an error occurred
		else   {
			console.log(data);           // successful response
			return data;
		}
	});
};

module.exports.startInstances = function(listOfInstances) {
	var ec2 = new AWS.EC2();
	var params = {
		InstanceIds:listOfInstances,		
		Force:false
	}
	ec2.startInstances(params, function(err, data){
		if (err) console.log(err, err.stack); // an error occurred
		else   {
			console.log(data);           // successful response
			return data;
		}
	});
};

module.exports.terminateInstances = function(listOfInstances) {
	var ec2 = new AWS.EC2();
	var params = {
		InstanceIds:listOfInstances,		
		Force:false
	}
	ec2.terminateInstances(params, function(err, data){
		if (err) console.log(err, err.stack); // an error occurred
		else   {
			console.log(data);           // successful response
			return data;
		}
	});
};