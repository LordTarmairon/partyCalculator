//Important Variables
const lists = new Map();
var members = new Map();
var products = new Map();
var itemSelected = "";
var paidBy = "";

$(document).ready( function () {

    function getLists(){
        $("#lists").children("div").remove();

        // iterando sobre las claves (verduras)
        lists.forEach((list, key) => {
            printLists(list.name, list.desc, key)
        })
        return true;
    }

    function printLists(title, desc, key) {
        let htmlPosition = $("#lists");
        let html =
            `<div class="listcard card list-group-item-action" id="${key}">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <div class="row">
                        <div class="col col-md-10">
                            <span class="card-text ">${desc}</span>
                        </div>
                        <div class="col col-md-2 align-self-end">
                            <span class="text-right">01.02.1994</span>
                        </div>
                    </div>
                </div>
            </div>`;
        return htmlPosition.append(html);
    }

    function hashGenerator(){
        let hash = Math.random().toString(36).substring(7);
        return hash.toString();
    }

    //EVENTS
    $(document).on("click", ".list-group-item-action", function(){
        if(itemSelected === this.id){
            itemSelected = "";
        } else if(itemSelected === "" || itemSelected !== this.id){
            itemSelected = this.id;
        }
    })

    $("#btn-addMember").on("click", function () {
        let name = $("#membername").val();
        let payer = document.getElementById('thisPayer').checked;
        if(name === ""){
            swal("Empty values", "Insert Name", "error");
            return;
        }
        if(payer) {
            paidBy = name;
        }
        let hash = hashGenerator();
        members.set(hash, new Member(hash, name, payer));
        $("#membername").val("");
        document.getElementById('thisPayer').checked = false;
        printTable();
    })
    $("#btn-openNewProduct").on("click", function () {
        $("#membersHere").html("");
        let allMembers = $("#AllMembers");
        if(members.size <= 0){
            allMembers.prop("disabled", "disabled");
            return;
        }
        allMembers.prop("disabled", "");

        members.forEach((member, key)=> {
            let html = `<div class="form-check m-3">
                    <input class="form-check-input member-check" type="checkbox" value="${member.id}">
                    <label class="form-check-label" for="flexCheckChecked">
                    ${member.name}
                    </label>
                </div>`;
            $("#membersHere").append(html);
        });
    })

    $("#AllMembers").on("change", function () {
        console.log(document.getElementById('AllMembers').checked)
        if(document.getElementById('AllMembers').checked){
            $(".member-check").map((key, input)=>{
                input.checked = true;
            })
        } else {
            $(".member-check").map((key, input)=>{
                input.checked = false;
            })
        }

    });
    $("#btn-dl-list").on("click", function () {
        if(itemSelected !== ""){
            lists.delete(itemSelected);
            getLists();
        }
    })
    $("#btn-add-list").on("click", function () {
        let name = $("#budgetName").val();
        let desc = $("#budgetDesc").val();
        let hash = hashGenerator();
        lists.set(hash, new Lista(hash, name, desc));
        if(getLists()){
            $("#budgetName").val("");
            $("#budgetDesc").val("");
        }
        $("#soloUnUso").addClass("d-none")

    })
    $(document).on("dblclick", ".listcard",function () {
        $("#titleList").text(lists.get(this.id).name)
        $("#appNav").addClass("d-none");
        $("#listNav").removeClass("d-none");
        $("#listFooter").removeClass("d-none");
        $("#appFooter").addClass("d-none");

        $("#lists").children("div").remove();
        printTable()
    })
    $("#btn-back").on("click", function () {
        $("#appNav").removeClass("d-none");
        $("#listNav").addClass("d-none");
        $("#listFooter").addClass("d-none");
        $("#appFooter").removeClass("d-none");

        getLists();

    });
    $("#btn-add-product").on("click", function () {
        let name = $("#productName");
        let amount =$("#productAmount");
        let price = $("#productPrice");
        let category= $("#productCategory");
        let hash = hashGenerator();
        if(name == "" || amount == "" || price == ""){
            swal("Empty values", "Insert Name, Amount, Price and Members", "error");
            return;
        }
        let product = new Product(hash, name.val(), amount.val(), price.val());
        $(".member-check").map((key, member)=>{
            if(member.checked){
                let aMember = members.get(member.value);
                product.addMember(aMember);
                aMember.addProduct(product);
            }
        });
        products.set(hash, product);

        members.forEach((value, key)=>{
            if(value.products.get(product.id)){
                value.updateTotalPrice(product.id)
                members.set(key, value);
            }
        })
        printTable();
        name.val("");
        amount.val(1);
        price.val(0);
        category.val("");
        if(document.getElementById("AllMembers").checked){
            document.getElementById("AllMembers").checked = false;
        }

    });
    //END EVENTS
    /* Formatting function for row details - modify as you need */
    function format(d) {
         var newTable =
            '<table cellpadding="5" cellspacing="0" border="0" class="table table-striped table-bordered" style="width:50%;">' +
            '<thead>' +
            '<tr>' +
            '<th>Member Name</th>' +
            '<th>Total</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
            d.members.forEach((value, key)=>{
                newTable+=    '<tr>' +
                    '<td>'+value.name+'</td>' +
                    '<td>'+ d.pricePerMember +'€</td>' +
                    '</tr>';
            })

          newTable+= '</tbody>' +
            '</table>';
        // `d` is the original data object for the row
        return newTable;
    }

    function format2(d) {
         var newTable =
            '<table cellpadding="5" cellspacing="0" border="0" class="table table-striped table-bordered" style="width:50%;">' +
            '<thead>' +
            '<tr>' +
            '<th>Product Name</th>' +
            '<th>Price Per Member</th>' +
            '<th>Total Participants</th>' +
            '<th>Total Price</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        d.products.forEach((value, key)=>{
            newTable+=    '<tr>' +
                '<td>'+value.name+'</td>' +
                '<td>'+ value.pricePerMember +'€</td>' +
                '<td>'+ value.participants +'</td>' +
                '<td>'+ value.getTotalPrice() +'</td>' +

                '</tr>';
        })

        newTable+= '</tbody>' +
            '</table>';
        // `d` is the original data object for the row
        return newTable;
    }

    // Add event listener for opening and closing details
    $(document).on('click', '#tableProducts tbody td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = table2.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
        } else {
            // Open this row
            row.child(format(row.data())).show();
        }
    });

    // Add event listener for opening and closing details
    $(document).on('click', '#tableMembers tbody td.dt-control', function () {
        var tr = $(this).closest('tr');
        var row = table1.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
        } else {
            // Open this row
            row.child(format2(row.data())).show();
        }
    });

    $('.tableInf').on('requestChild.dt', function (e, row) {
        row.child(format(row.data())).show();
    });
    var table2;
    var table1;
    function printTable() {
        if($("#tableProducts")){
            $("#lists").children("div").remove();
        }
        let totalPay = 0;
        products.forEach((value, key) => {
            totalPay += (parseFloat(value.price) * value.amount);
        })
        let acordeon = `<div class="accordion" id="accordionExample">        
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    <h5>Products</h5>
                </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <table id="tableProducts" class="tableInf"> 
                        <thead>
                            <tr>
                                <th></th>
                                <th>Product Name</th>
                                <th>Amount</th>
                                <th>Price</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th>Product Name</th>
                                <th>Amount</th>
                                <th>Price</th>
                                <th>Total Price</th>
                            </tr>
                        </tfoot>
                    </table>
                    <div class="bg-success text-end p-2 rounded mt-1"> <h6 class="wf-bold"> Total Build: ${totalPay}€ </h6></div>
                    <div class="bg-primary text-end p-2 rounded mt-1"> <h6 class="wf-bold"> Paid by: ${paidBy} </h6></div>

                </div>
            </div>
        </div>
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                    <h5>Members</h5>
                </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <table id="tableMembers" class="tableInf">
                        <thead class="1">
                            <tr>
                                <th></th>
                                <th>Member Name</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tfoot>
                            <tr>
                                <th></th>
                                <th>Name</th>
                                <th>Total</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </div>`;

        $("#lists").append(acordeon);
        var miembros = array = Array.from(members, ([id, member]) => (member));
        var productos = array = Array.from(products, ([id, product]) => (product));

        table1 = $('#tableMembers').DataTable({
            data: miembros,
            paging: false,

            rowId: 'id',
            stateSave: true,
            initComplete: function () {
                var api = this.api();
                api.$('.searchable').click(function () {
                    api.search(this.innerHTML).draw();
                });
            },
            columns: [
                {
                    className: 'dt-control',
                    orderable: false,
                    data: null,
                    defaultContent: '',
                },
                { data: 'name', className: 'searchable' },
                { data: 'printTotal', className: 'searchable' },
            ],
            order: [[1, 'asc']],
        });
        table2 = $('#tableProducts').DataTable({
            data: productos,
            paging: false,
            rowId: 'id',
            stateSave: true,
            initComplete: function () {
                var api = this.api();
                 api.$('.searchable').click(function () {
                    api.search(this.innerHTML).draw();
                });
            },
            columns: [
                {
                    className: 'dt-control',
                    orderable: false,
                    data: null,
                    defaultContent: '',
                },
                { data: 'name', className: 'searchable' },
                { data: 'amount', className: 'searchable' },
                { data: 'getPrice' , className: 'searchable' },
                { data: 'getTotalPrice' , className: 'searchable' },

            ],
            order: [[1, 'asc']],
        });

    }

    //Calls
    getLists();

});
