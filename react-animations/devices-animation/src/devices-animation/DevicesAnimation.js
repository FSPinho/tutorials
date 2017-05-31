/**
 * 
 * 2017 - CYTECH INFORMÁTICA
 * Cainã Mello, Felipe da Silva Pinho, Marques do Nascimento Amaro
 * 
 * 
 * Fala, pessoal! Beleza?
 * Eu sou Cainã Mello, membro da empresa de desenvolvimento de software
 * Cytech Informática.
 * 
 * Nesse vídeo eu vou mostrar pra vocês como fazer uma animação de dispositivos
 * usando React. Essa é apenas uma demonstração simples de como fazer, sintam-se 
 * livres pra melhorar, adicionar mais elementos e usar nos seus projetos.
 * 
 * Antes de assistir a esse vídeo, é interessante que vocês já saibam o básico de CSS, 
 * ECMAScript 2016 (ou javascrit 2016) e react. Eu recomendo também que vocês deem uma olhada rápida
 * na documentação do React sobre animações, que tá disponível nesse link: 
 * https://facebook.github.io/react-native/docs/animations.html
 * Não precisa ler tudo, apenas o suficiente pra ter uma noção básica de como 
 * a animação é construída
 * 
 * Pra criar o projeto eu usei o 'create-react-app', que pode ser encontrado nesse link:
 * https://github.com/facebookincubator/create-react-app
 * Após a criação do projeto, instalei o plugin react-native-web com o comando
 * >> npm install react-native-web
 * É esse plugin que vai nos dar o suporte a animação. Criei então o diretório devices-animation
 * e, dentro do mesmo, criei arquivo DevidesAnimation.js, que vai conter o componente react que
 * será animado.
 * 
 * Não esqueça de declarar o componente no arquico App.js (Aqui usamos o recurso flexbox para
 * centralizar tudo na tela)
 * 
 * Agora vamos a implementação do componente!
 * 
 */


/**
 * Aqui nos importamos as classes que necessárias
 * Note que é o react-native-web que nos provém as classes Animated e Easing, 
 * que usaremos na animação
 */
import React, { Component } from 'react'
import { Animated, Easing } from 'react-native-web'

/**
 * Tamanho do container da animação. Os dispositivos, desktop, tablet e celular terão suas dimensões
 * calculadas em relação a essa medida.
 */
const SIZE = 480

/**
 * Relação entre a altura e a largura dos dispositivos. É comum que as telas atuais apresentem
 * uma proporção de 16/9 pixels, que é aproximadamente 1.7777 
 */
const RATIO = 1.7777

/**
 * Nome dos passos a serem executados. Aqui são armazenados em constantes apenas por questões de 
 * organização
 */
const DESKTOP = 'desktop'
const TABLET = 'tablet'
const PHONE = 'phone'

/**
 * Estilo das divs que serão usadas na animação. Todas têm posição absoluta, preenchendo todo
 * o elemento pai, já que o elemento pai é quem será animado.
 * Todas apresentam também, uma borda vermelha de 2 pixels. Elas apresentam, também,
 * um display flex, o que nos ajuda a distribuir e centralizar os elementos filhos verticalmente.
 * Estou supondo aqui que você já tenha um conhecimento de CSS e de flexbox
 */
const STYLE = {
	position: 'absolute',
	top: 0, bottom: 0, left: 0, right: 0,
	border: '#F00 2px solid',
	borderRadius: 16,
	display: 'flex',
	flexDirection: 'column', 
	alignItems: 'center',
	justifyContent: 'center'
}

/**
 * Esses são os passos da animação. O primeiro passo, por exeplo, que se chama desktop, 
 * guarda as medidas que darão a cada elemento o formato correto de um monitor desktop, 
 * que contém bordas, uma tela, e um botão. Esses elemento representam com simplicidade
 * a maioria dos dispositivos atuais. Note que todos os valores são setados em relação ao 
 * valor da constante SIZE, assim poderemo mudar facilmente o tamanho da animalção, 
 * inclusive, recebendo-o via props.
 */
const ANIM_STEPS = {
	[DESKTOP]: {
		boundsWidth: SIZE,
		boundsHeight: SIZE / RATIO,
		boundsRotation: 0, 

		screenWidth: SIZE * 0.97,
		screenHeight: SIZE / RATIO * 0.75,
		screenMarginTop: 0,
		screenMarginBottom: SIZE * 0.04,

		circleSize: SIZE * 0.06, 
	},
	[TABLET]: {
		boundsWidth: SIZE / RATIO * 0.9,
		boundsHeight: SIZE * 0.7,
		boundsRotation: 90, 

		screenWidth: SIZE / RATIO * 0.8,
		screenHeight: SIZE * 0.5,
		screenMarginTop: SIZE * 0.04, 
		screenMarginBottom: SIZE * 0.02, 

		circleSize: SIZE * 0.05, 
	},
	[PHONE]: {
		boundsWidth: SIZE / RATIO * 0.5,
		boundsHeight: SIZE * 0.6,
		boundsRotation: 0, 

		screenWidth: SIZE / RATIO * 0.45,
		screenHeight: SIZE * 0.45,
		screenMarginTop: SIZE * 0.04, 
		screenMarginBottom: SIZE * 0.02, 

		circleSize: SIZE * 0.04, 
	},
}

/**
 * Definição do componente animado
 */

export default class DevicesAnim extends Component {

	constructor(props) {
		super(props);
		
		/**
		 * Aqui nós queremos mapear cada propriedade animada para um objeto 
		 * do tipo Animated.Value
		 * 
		 * this.state = {
		 *		boundsWidth: new Animated.View(SIZE),
		 *		boundsHeight: new Animated.View(SIZE / RATIO),
		 *		...
		 * },
		 * 
		 * Mas, para que não seja necessário fazer isso a todos os valores manualmete,
		 * usaremos um atalho: percorreremos as chaves do objeto correspondente ao passo
		 * inicial da animação, trabsformando os valores em objetos do tipo Animated.Value.
		 * Note que obteremos um resultado igual ao mostrado acim, com a adição do atributo
		 * currentStep, que indica qual o passo (desktop, tablet ou phone) atual da animação
		 */

		const initialStep = this.props.initialStep || DESKTOP
		this.state = {
			currentStep: initialStep,
		}
		const step = ANIM_STEPS[initialStep]

		/* Percorrendo as chaves do objeto step */
		Object.keys(step).map(k => {

			/** 
			 * Convertendo os valores
			 * Ex.: this.state[boundsWidth] = new Animated.Value( ... ) 
			 */
			this.state[k] = new Animated.Value(step[k])
		})
	}

	/**
	 * Método que modifica o passo atual da animação, sendo executado apenas
	 * se o novo passo for diferente do antigo.
	 */
	changeStep = stepKey => {
		if(stepKey === this.step) return

		const step = ANIM_STEPS[stepKey]

		/**
		 * Criaremos uma animação para cada atributo a ser animado, armazenando
		 * os objetos criados no array animations
		 */
		const animations = Object.keys(step).map(key => {
			return Animated.timing(
				
				/* Valor a ser animado. Ex.: this.state.boundsWidth */
				this.state[key], 
				{ 
					/* Valor para o qual a animação irá convergir */
					toValue: step[key], 

					/* Tipo de função usada na animação */
					easing: Easing.inOut(Easing.cubic) 
				}
			)
		})

		/** 
		 * Aqui nós atualizamos o estado com o novo passo da animação e, como
		 * consequência, provocamos a chamada do método render().
		 */
		this.setState({ step: stepKey })

		/**
		 * Iniciando as animações criadas anteriormente. Note que todas ocorrerão 
		 * paralelamente.
		 */
        Animated.parallel(animations).start()
	}

	/**
	 * Usaremos este método do cíclo de vida do componente par dar início
	 * ao loop responsável por trocar constantemente o passo atual da animação.
	 * O método componentDidMount é chamado uma vez após a primeira renderização do 
	 * componente na tela
	 */
	componentDidMount() {
		/**
		 * Armazenando os passos da animação em um array e iniciando o indice que será 
		 * usado para referenciar o passo atual
		 */
		const steps = [ DESKTOP, TABLET, PHONE ] 
		let index = 0

		/**
		 * Aqui o método setInterval() é usado para criar um loop, onde a função
		 * this.changeStep() será executada uma vez à cada segundo. Note que (++index % steps.length)
		 * retornará valores que sempre representarão índices do array de passos da animação
		 */
		setInterval(() => this.changeStep(steps[++index % steps.length]), 1000)
	}

	render() {

		/**
		 * Para modificar a rotação do elemento, usaremos o atributo transform. O mesmo
		 * aceita valores com o sufixo 'deg', logo, precisaremos fazer a transposição
		 * dos valores, como recomenda a documentação do react:
		 * https://facebook.github.io/react-native/docs/animations.html
		 */
		const boundsRotation = this.state.boundsRotation.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg']
        })

		/**
		 * Aqui, atribuiremos os valores animados aos elementos correspondentes. Note que
		 * os elementos que suportam animação são os do tipo <Animated.View>, mas estes não
		 * suportam estilização. Assim, usaremos os elements <Animated.View> apenas como 
		 * parentes dos elementos estilizados, que receberão as bordas e cores.
		 */

		return (
			<div>
				{ /* Elemento responsável por animar as bordas do dispositivo */ }
				<Animated.View style={{
					width: this.state.boundsWidth,
					height: this.state.boundsHeight,
					transform: [{ rotate: boundsRotation }] 
				}}>

					{ /* Elemento que representa graficamente as bordas do dispositivo */ }
					<div style={ STYLE }>

						{ /* Animação da tela do dispositivo */ }
						<Animated.View style={{
							width: this.state.screenWidth,
							height: this.state.screenHeight,
							marginTop: this.state.screenMarginTop,
							marginBottom: this.state.screenMarginBottom
						}}>

							{ /* Representação gráfica da tela do dispositivo */ }
							<div style={{ ...STYLE, borderRadius: 0 }}/>

						</Animated.View>

						{ /* Animação do botão do dispositivo */ }
						<Animated.View style={{
							width: this.state.circleSize,
							height: this.state.circleSize,
						}}>

							{ /* Representação gráfica do botão do dispositivo */ }
							<div style={{ ...STYLE, borderRadius: '50%' }}/>

						</Animated.View>

					</div>

				</Animated.View>
			</div>
		)

	}

}