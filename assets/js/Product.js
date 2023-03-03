class Product {
    id;
    name;
    amount;
    members = new Map();
    price;
    pricePerMember = 0;
    participants = 0;
    constructor(id, name, amount = 1, price = 0) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.price = price;
    }

    getPrice() {
        return this.price +"€";
    }
    addMember(member){
        this.members.set(member.id, member);
        this.getTotalPerMember();
        this.participants++;
    }
    getTotalPrice(){
        let totalPrice = parseFloat(this.price) * this.amount;
        return totalPrice + "€";
    }
    getTotalPerMember(){
        let totalPrice = parseFloat(this.price) * this.amount;
        this.pricePerMember = parseFloat(totalPrice / this.members.size).toFixed(2);
    }


}
