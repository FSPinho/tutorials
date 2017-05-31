import React, { Component } from 'react'
import { Animated, Easing } from 'react-native-web'

const SIZE = 240 // Animation container size
const RATIO = 1.7777 // Width/Height

const DESKTOP = 'desktop' // Steps...
const TABLET = 'tablet'
const PHONE = 'phone'

// Default div style
const STYLE = {
	position: 'absolute',
	top: 0, bottom: 0, left: 0, right: 0,
	border: '#F00 2px solid',
	borderRadius: 8,
	display: 'flex',
	flexDirection: 'column', 
	alignItems: 'center',
	justifyContent: 'center'
}

// Animations steps
const ANIM_STEPS = {
	[DESKTOP]: {
		boundsWidth: SIZE,
		boundsHeight: SIZE / RATIO,
		boundsRotation: 0, 

		screenWidth: SIZE * 0.95,
		screenHeight: SIZE / RATIO * 0.75,
		screenMarginTop: 0,
		screenMarginBottom: SIZE * 0.02,

		circleSize: SIZE * 0.05, 
	},
	[TABLET]: {
		boundsWidth: SIZE / RATIO * 0.9,
		boundsHeight: SIZE * 0.9,
		boundsRotation: 90, 

		screenWidth: SIZE / RATIO * 0.8,
		screenHeight: SIZE * 0.7,
		screenMarginTop: SIZE * 0.04, 
		screenMarginBottom: SIZE * 0.02, 

		circleSize: SIZE * 0.04, 
	},
	[PHONE]: {
		boundsWidth: SIZE / RATIO * 0.6,
		boundsHeight: SIZE * 0.6,
		boundsRotation: 0, 

		screenWidth: SIZE / RATIO * 0.54,
		screenHeight: SIZE * 0.4,
		screenMarginTop: SIZE * 0.04, 
		screenMarginBottom: SIZE * 0.02, 

		circleSize: SIZE * 0.05, 
	},
}

export default class DevicesAnim extends Component {

	constructor(props) {
		super(props);
		
		/**
		 * MAPPING THE ANIMATION STEPS
		 * https://facebook.github.io/react-native/docs/animations.html
		 */

		/**
		 * We want to get this state, with the 'desktop' step given the initial values
		 * 
		 * this.state = {
		 *		boundsWidth: new Animated.View(SIZE),
		 *		boundsHeight: new Animated.View(SIZE / RATIO),
		 *		boundsRotation: new Animated.View(0), 
		 *
		 *		screenWidth: new Animated.View(SIZE * 0.95),
		 *		screenHeight: new Animated.View(SIZE / RATIO * 0.75),
		 *		screenMarginTop: new Animated.View(0),
		 *		screenMarginBottom: new Animated.View(SIZE * 0.02),
		 *
		 *		circleSize: new Animated.View(SIZE * 0.05), 
		 *	},
		 */

		const initialStep = this.props.initialStep || DESKTOP
		this.state = {
			currentStep: initialStep,
		}
		const step = ANIM_STEPS[initialStep]

		/* Siving the step keys and values to state */
		Object.keys(step).map(k => {

			/* E.g.: this.state[boundsWidth] = new Animated.Value( ... ) */
			this.state[k] = new Animated.Value(step[k])
		})
	}

	changeStep = stepKey => {
		if(stepKey === this.step) return

		const step = ANIM_STEPS[stepKey]
		const animations = Object.keys(step).map(key => {
			return Animated.timing(
				/* Value that will be animated */
				this.state[key], 
				{ 
					/* Final animation value */
					toValue: step[key], 

					/* Animation type */
					easing: Easing.inOut(Easing.cubic) 
				}
			)
		})

		/* Changing the current state to fire the render method */
		this.setState({ step: stepKey })

		/* Starting all animations */
        Animated.parallel(animations).start()
	}

	componentWillMount() {
		const steps = [ DESKTOP, TABLET, PHONE ] 
		let index = 0

		/* Repeating the step change */
		setInterval(() => this.changeStep(steps[++index % steps.length]), 1000)
	}

	render() {

		// Converting to the rotation units (deg)
		const boundsRotation = this.state.boundsRotation.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg']
        })

		return (
			<div>
				{ /* BoundsAnimatedView */ }
				<Animated.View style={{
					width: this.state.boundsWidth,
					height: this.state.boundsHeight,
					transform: [{ rotate: boundsRotation }] 
				}}>

					{ /* BoundsDiv (It will fill the parent) */ }
					<div style={ STYLE }>

						{ /* ScreenAnimatedView */ }
						<Animated.View style={{
							width: this.state.screenWidth,
							height: this.state.screenHeight,
							marginTop: this.state.screenMarginTop,
							marginBottom: this.state.screenMarginBottom
						}}>

							{ /* ScreenDiv (It will fill the parent) */ }
							<div style={ STYLE }/>

						</Animated.View>

						{ /* CircleAnimatedView */ }
						<Animated.View style={{
							width: this.state.circleSize,
							height: this.state.circleSize,
						}}>

							{ /* CircleDiv (It will fill the parent) */ }
							<div style={{ ...STYLE, borderRadius: '50%' }}/>

						</Animated.View>

					</div>

				</Animated.View>
			</div>
		)

	}

}