function Carro(velocidadeMaximo = 200, delta= 10){
    let velocidadeAtual = 0;

    this.acelerar = function(){
        if(velocidadeAtual + delta <= velocidadeMaximo){
            velocidadeAtual += delta;
        }else{
            velocidadeAtual = velocidadeMaximo;
        }
    }
    
    this.getVelocidadeAtual = function(){
        return velocidadeAtual;
    }
}

Ferrari = new Carro();

Ferrari.acelerar();
console.log(Ferrari.getVelocidadeAtual())

