const UI = (function(){
    const UISelector = {
        gameContent : '.game-content',

    }
    return{
        getUISelector : function(){
            return UISelector;
        }
    }



})();
const Game = (function(UI){
    let board ;
    let currentPlayer;
    let userposes=[];
    let winPath=[];
    let userProbably = [];
    let sysProbably = [];
    let lastUserPos ;
    const findDuplicates = function(data){
        let result = [];

        data.forEach(function(element, index) {
          
          // Find if there is a duplicate or not
          if (data.indexOf(element, index + 1) > -1) {
            
            // Find if the element is already in the result array or not
            if (result.indexOf(element) === -1) {
              result.push(element);
            }
          }
        });
      
        return result;
    }
    const colorWinner = function(path,color){

        let gameContent = document.querySelector(UI.getUISelector().gameContent);
        path.split('').forEach(item => {
            gameContent.children[parseInt(item/3)].children[item%3].style.backgroundColor = color;
        })
        
       // let square = gameContent.children[parseInt(item/3)].children[item%3];

    }
    const finishGame = function(winner){
        let gameContent = document.querySelector(UI.getUISelector().gameContent);
        gameContent.style.pointerEvents = 'none';
        console.log(`!!!!!!! ${winner} win !!!!!!!`)
    }
    const checkStatus = function(){
        //set probably winning for user
        
       winPath.forEach(item =>{
            if(item.indexOf(userposes[userposes.length - 1])!=-1)
            {
                    userProbably.push(item);
            }
        })
        //it's for filter user probably :
        sysProbably =filterArray(sysProbably , userProbably);
        
        console.log('user probably at first:',userProbably)
        let gameContent = document.querySelector(UI.getUISelector().gameContent);
        //-----------------------------------choose move for system:---------------------------------------------------

        //first-> check for system wining:
        
        let result=[];
        if(findDuplicates(sysProbably)[0]!= undefined){
            let answer = null;
            result = findDuplicates(sysProbably)[0];
            console.log('first if is run!');
            result.split('').forEach(item => {
                //check whick square is null:
                let square = gameContent.children[parseInt(item/3)].children[item%3];
               if (square.firstElementChild.textContent === '' ) {
                   console.log('we find good move and it is :', item);
                   answer = item;
                   colorWinner(result,'lightgreen');
                   finishGame('system')
                   
               }
            })
            return answer;
        }
        


        

        //second->check for user wining:
        else if(findDuplicates(userProbably)[0]!= undefined){
            let answer = null;
            result=findDuplicates(userProbably)[0];
            console.log('second if is run!',result)
            result.split('').forEach((item,index) => {
                let square = gameContent.children[parseInt(item/3)].children[item%3];
               if (square.firstElementChild.textContent === '' ) {
                console.log('we find good move for stop user :D and it is :', item);
                answer = item;
            }
            
            })
            return answer;
        }
        
        
        //third-> check for two status :
        //in first if 4 pos is null fill it :
        
        else if (gameContent.children[1].children[1].firstElementChild.textContent==='') {
            console.log('we find good move and it is :', 4);
            return 4 ; 
        }else if (gameContent.children[0].children[0].firstElementChild.textContent==='') {
            console.log('we find good move and it is :', 0);
            return 0 ; 
        }else{
           let answer;
            let result = [];
            for (let n = 0; n < 9; n++) {
                if (gameContent.children[parseInt(n/3)].children[n%3].firstElementChild.textContent==='') {
                    let count =0;
                    userProbably.forEach(item => {  
                       if (item.indexOf(n) !== -1) {
                           count++;
                           console.log()
                           if (count===2) {
                               result.push(n);
                           }
                       } 
                    })
                   
                }
            }
            //if result has one length:
            let bestItem;
            if (result.length === 2) {
                console.log('dota')
                bestItem = sysProbably.filter(item => {
                    if (item.indexOf(result[0]) === -1 && item.indexOf(result[1] === -1) ) {
                        return true;
                    }
                })           
            }
            //if result has two length:
            else if (result.length === 1 || result.length > 2){
                console.log('yeki')
                bestItem = sysProbably.filter(item => {
                    if (item.indexOf(result[0]) !== -1) {
                        return true;
                    }
                })     
            }
    
            bestItem[0].split('').forEach((item,index) => {
                let square = gameContent.children[parseInt(item/3)].children[item%3];
               if (square.firstElementChild.textContent === '' ) {
                console.log('we find good move for stop user :D and it is:', item);
                answer = item;
                
            }
            
            })
            console.log('it\'s answer:',answer);
            return answer;
        }
            


        

        //check vertical:


        //check oblique:


    }
    const filterArray = function(array1,array2){
        if (array1[0] !== undefined) {
            array1 = array1.filter(item => {
                if (!array2.includes(item)) {
                    return true;
                }
            })
            return array1;
        }else
        return [];
        
        
    }
    const domEventListener = function(){
        //click document :
        document.addEventListener('click',playGameByUser);

    }
    const playGameByUser = function(e){

        
        if (e.target.classList.contains('square')) {
            let pos = Number(e.target.id.split('-')[1]);
            let squ = document.querySelector(`#${e.target.id}`);
            //or an set an icon instead of X
            squ.firstElementChild.textContent = 'X';
            squ.style.pointerEvents = 'none';
            userposes.push(pos);
            //set system move:
            let systemMove = checkStatus();
            if (systemMove !== null) {
                winPath.forEach(item =>{
                    if(item.indexOf(systemMove)!=-1)
                    {
                            sysProbably.push(item);
                    }
                })
                let gameContent = document.querySelector(UI.getUISelector().gameContent);
                userProbably = filterArray(userProbably , sysProbably);
                gameContent.children[parseInt(systemMove/3)].children[systemMove%3].firstElementChild.textContent = 'O';
                gameContent.children[parseInt(systemMove/3)].children[systemMove%3].style.pointerEvents = 'none';
            } else {
                console.log('!!!!!!the game is in equal!!!!!!')
            }
            

            console.log('sytemMove:' , systemMove);
        }
        
        
        
    }
    return {
        init:function(){
            winPath = ['012','345','678','036','147','258','048','246'];
            userProbably = [];
            sysProbably = [];
            board = [
                ['','',''],
                ['','',''],
                ['','','']
            ];
            currentPlayer = 'user';
            domEventListener();

        },
        
        //pos = [0-8]
       
    }

     
    
})(UI);
Game.init();

