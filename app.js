// BUDGET CONTROLLER
var budgetController = (function(){
    var Expense = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    }
    var Income = function(id, desc, value){
        this.id = id;
        this.desc = desc;
        this.value = value;
    }
    var data = {
         allItems: {
            exp : [],
            inc : [],
         },
         totals : {
             exp: 0,
             inc: 0
         },
         budget: 0,
         percentage: -1
    }
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    }

    return {
        addItem: function(type, desc, value) {
            var newItem, ID;
            // id = last id + 1 
            //create id 
            var length = data.allItems[type].length;
            ID = length === 0 ? 0 : data.allItems[type][length - 1].id + 1; 
            //create new item 
            if(type === 'exp') {
                newItem = new Expense(ID, desc, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, desc, value);
            }
            //push it into data structure
            data.allItems[type].push(newItem);
            //return the new item
            return newItem; 
        },
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calculate budget 
            data.budget = data.totals.inc - data.totals.exp;
            // calculate persentage of income that we spent 
            if(data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp/data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },
        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpense: data.totals.exp,
                percentage: data.percentage
            }
        }
    }
})();



// UI CONTROLLER 
var UIController = (function() {

    var DOMStrings = {
        inputType : '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        incTotal: '.budget__income--value',
        expTotal: '.budget__expenses--value',
        budgetVal: '.budget__value',
        percentage: '.budget__expenses--percentage',
        container: '.container'
    }
    // some code 
    return {
        getInput: function() {
            return {
                 type : document.querySelector(DOMStrings.inputType).value,// will be either inc or exp
                 desc : document.querySelector(DOMStrings.inputDesc).value,
                 value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        getDOMStrings: function() {
            return DOMStrings;
        },
        addListItem: function(obj, type,) {
            var html, newHtml, element;
            //1, create html string with ph text
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if(type === 'exp') {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            //2, replace ph text with actual data 
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.desc);
            newHtml = newHtml.replace('%value%', obj.value);
            //3, insert html into dom 
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
         },
         clearFields: function() {
            var fields, fieldsArray, 
            fields = document.querySelectorAll(DOMStrings.inputDesc + ', ' + DOMStrings.inputValue);
            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(cur, index, array) {
                cur.value = '';
            });
            fieldsArray[0].focus();
         },
         displayBudget: function(obj) {
            document.querySelector(DOMStrings.incTotal).textContent = obj.totalIncome;
            document.querySelector(DOMStrings.expTotal).textContent = obj.totalExpense;
            document.querySelector(DOMStrings.budgetVal).textContent = obj.totalIncome - obj.totalExpense;
            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentage).textContent = obj.percentage;
            } else {
                document.querySelector(DOMStrings.percentage).textContent = '---';
            }
         }
    };
})();



// GLOBAL APP CONTROLLER 
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.addBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) {
            if(event.keycode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        }); 
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    }

    var ctrlDeleteItem = function(event) {
        var itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;// hard coded dom structure here 
        if(itemId) {
            //inc-1
            var splitID, type, ID;
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[i];
            // delete item from data structure 
            // delelte item from UI
            //update and show new budget 
        }

    };

    var updateBudget = function() {
           // 1, calculate budget
           // 2, return budget
           //3, display budget on the UI
           budgetCtrl.calculateBudget();
           var budget = budgetCtrl.getBudget();
           // 5, display budget
           UICtrl.displayBudget(budget);
    }
    
    var ctrlAddItem = function() {
        var input, newItem, data;
        // 1, get input data 
        input = UICtrl.getInput();
        if(input.desc !== '' && !isNaN(input.value) && input.value !== 0) {
            // 2, add item to budgetCtrl
            newItem = budgetCtrl.addItem(input.type, input.desc, input.value);
            // 3, add item to UI 
            UICtrl.addListItem(newItem, input.type);
            UICtrl.clearFields();
            updateBudget();
        }
    }

    return {
        init: function(){
            console.log('applications started');
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpense: 0,
                percentage: -1
            })
            setupEventListeners();
        }
    }

})(budgetController, UIController);

controller.init();