(function(){
    let Ubersmith = require('../lib');
    let client = new Ubersmith('https://192.168.2.182', 'admin', 'tZhFqYqQwy4Xqkzh3V2yLfKpKh766T34');

    let request = client.call()
        .then(r =>{
            console.log('here', r)
        });

}).call(this);