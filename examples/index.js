(function(){
    let Ubersmith = require('../lib');
    let client = new Ubersmith('https://192.168.2.182', 'admin', 'tZhFqYqQwy4Xqkzh3V2yLfKpKh766T34');

    let request = client.call();


    console.log('here')
    // client.request.send(request,function(err, result){
    //     console.log(result);
    //     console.log('Error: '+ err);
    //     console.log('Errors: ');
    //     console.log(result.errors)
    // });

}).call(this);