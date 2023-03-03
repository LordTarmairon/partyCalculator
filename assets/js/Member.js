class Member {
    id;
    name;
    products = new Map();
    payer;
    total = 0;

    constructor(id, name, payer = false) {
        this.id = id;
        this.name = name;
        this.payer = payer;
    }

    addProduct(product){
        this.products.set(product.id, product);
    }

    updateTotalPrice(productHash){
        var participantes = this.products.get(productHash).participants;
        this.total = parseFloat(parseFloat(this.total) + parseFloat(this.products.get(productHash).pricePerMember));
    }
    printTotal(){
        return this.total + "€";
    }

}
