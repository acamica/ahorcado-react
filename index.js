class Palabra extends React.Component {
  render() {
    return <div className="palabra">
      {this.props.palabra.split('').join(' ')}
    </div>;
  }
}

var espacio = <span>&nbsp;</span>;

class Hombre extends React.Component {
  render() {
    var nivel = this.props.nivel;
    var parts = {
      cabeza: nivel >= 7 && 'X' || nivel >= 1 && 'O' || espacio,
      cuerpo: nivel >= 2 && '|' || espacio,
      brazoIzquierdo: nivel >= 3 && '/' || espacio,
      brazoDerecho: nivel >= 4 && '\\' || espacio,
      pieIzquierdo: nivel >= 5 && '/' || espacio,
      pieDerecho: nivel >= 6 && '\\' || espacio
    };
    return <div className="hombre">
      <div>{parts.cabeza}</div>
      <div>{parts.brazoIzquierdo}{parts.cuerpo}{parts.brazoDerecho}</div>
      <div>{parts.trunk}</div>
      <div>{parts.pieIzquierdo}{parts.pieDerecho}</div>
    </div>;
  }
}

class Horca extends React.Component {
  render() {
    var estiloContenedor = {
      width: this.props.ancho,
      height: this.props.alto
    };

    var estiloContenido = {
      width: this.props.anchoContenido,
      marginLeft: -this.props.anchoContenido/2,
    }

    return <div style={estiloContenedor}>
      <div className="horca-tope">
        <div className="horca-contenido" style={estiloContenido}>
          {this.props.children}
        </div>
      </div>
      <div className="horca-columna" />
      <div className="horca-plataforma" />
    </div>;
  }
}

class LetrasUsadas extends React.Component {
  render() {
    return <div>
      Letras usadas: {this.props.letras.join(' - ')}
      {' '}
      <input
        type="text"
        value=""
        className="input-letra"
        placeholder="Adivina una letra"
        onChange={this.handleNuevaLetra.bind(this)} />
    </div>;
  }

  handleNuevaLetra(ev) {
    var letra = ev.target.value[0];

    if (/[A-Za-z]/.test(letra)) {
      this.props.onNuevaLetra(letra.toUpperCase());
    }
  }
}

class FinDeJuego extends React.Component {
  render() {
    var mensaje = this.props.juegoGanado ?
      <span style={{color: 'green'}}>Ganaste!</span> :
      <span style={{color: 'red'}}>Perdiste!</span>;

    return <div>
      {mensaje}
      {' '}
      <button onClick={this.props.onResetearJuego}>Intenta otra vez</button>
    </div>;
  }
}

class Juego extends React.Component {
  render() {
    return <div className="juego">
      <Horca ancho={300} alto={300} anchoContenido={200}>
        <Hombre nivel={this.props.errores} />
      </Horca>
      <Palabra palabra={this.props.palabra} />
      {!this.juegoTerminado() ? <LetrasUsadas
        letras={this.props.letrasUsadas}
        onNuevaLetra={this.props.onNuevaLetra} /> :
        <FinDeJuego
          juegoGanado={this.props.juegoGanado}
          onResetearJuego={this.props.onResetearJuego} />
      }
    </div>;
  }

  juegoTerminado() {
    return this.props.juegoGanado || this.props.juegoPerdido;
  }
}

class App extends React.Component {
  constructor(props) {
    super();

    this.state = {
      palabra: elegirPalabra(),
      letrasUsadas: []
    };
    this.handleNuevaLetra = this.handleNuevaLetra.bind(this);
    this.handleResetearJuego = this.handleResetearJuego.bind(this);
  }

  render() {
    return <Juego
      errores={obtenerErrores(this.state.palabra, this.state.letrasUsadas)}
      letrasUsadas={this.state.letrasUsadas}
      palabra={palabraAdivinada(this.state.palabra, this.state.letrasUsadas)}
      juegoGanado={juegoEstaGanado(this.state)}
      juegoPerdido={juegoEstaPerdido(this.state)}
      onNuevaLetra={this.handleNuevaLetra}
      onResetearJuego={this.handleResetearJuego}
    />;
  }

  handleNuevaLetra(letra) {
    if (this.state.letrasUsadas.indexOf(letra) !== -1) {
      return;
    }

    this.setState({
      letrasUsadas: this.state.letrasUsadas.concat(letra)
    });
  }

  handleResetearJuego() {
    this.setState({
      palabra: elegirPalabra(),
      letrasUsadas: []
    });
  }
}

const palabras = [
  'JAVASCRIPT',
  'ACAMICA',
  'REACTJS',
  'DESARROLLADOR'
];

function elegirPalabra() {
  const indice = Math.floor(Math.random() * palabras.length);
  return palabras[indice];
}

function palabraAdivinada(palabra, letrasUsadas) {
  const letrasNoAdivinadas = _.difference(palabra.split(''), letrasUsadas);
  return letrasNoAdivinadas.reduce((palabraAdivinada, letrasNoAdivinada) => {
    return palabraAdivinada.replace(new RegExp(letrasNoAdivinada, 'g'), '_');
  }, palabra);
}

function obtenerErrores(palabra, letrasUsadas) {
  var errores = 0;
  letrasUsadas.forEach(function(letra) {
    if (palabra.indexOf(letra) === -1) {
      errores++;
    }
  });
  return errores;
}

function juegoEstaGanado(state) {
  return palabraAdivinada(state.palabra, state.letrasUsadas) === state.palabra;
}

function juegoEstaPerdido(state) {
  return obtenerErrores(state.palabra, state.letrasUsadas) >= 7;
}

ReactDOM.render(<App />, document.getElementById('content'));
