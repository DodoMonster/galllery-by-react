require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';


// 获取图片相关的数据
let imageDatas = require('../data/imageDatas.json');

// 利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = imageDatas.map((item) => {
	item.imageURL = 'images/' + item.fileName;
	return item;
});

// 获取区间内的随机值
function getRangeRandom(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

//  获取0-30°之间的任意正负值
function get30DegRandom() {
	return (Math.random() > .5 ? '' : '-' + Math.floor(Math.random() * 30));
}

class AppComponent extends React.Component {
	constructor(props) {
		super(props);
		this.Constant = {
			centerPos: {
				left: 0,
				top: 0
			},
			hPosRange: { // 左右两部分的取值范围
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { // 上部分的取值范围
				x: [0, 0],
				topY: [0, 0]
			}
		};

		// 初始化state，图片的left\top位置
		this.state = {
			imgsArrangeArr: []
		}
	}

	/* 翻转图片
	 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	 * @return {Function} 这是一个壁报函数，其内return一个真正待被执行的函数
	 */
	inverse(index) {
		return function() {
			let imgsArrangeArr = this.state.imgsArrangeArr;

			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
		}.bind(this);
	}

	/* 
	 * 利用rearRange函数，居中对应index的图片
	 * @param index，需要被居中的图片对应的图片信息数组的index值
	 * @return {Function}
	 */
	center(index) {
		return function() {
			this.rearRange(index);
		}.bind(this);
	}

	// 重新布局所有图片 centerIndex 指定居中排布哪个图片
	rearRange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,

			vPosRange = Constant.vPosRange,
			vPosRangeX = vPosRange.x,
			vPosRangeTopY = vPosRange.topY;

		let imgsArrangeCenterArr = [];
		imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1); //存放居中图片的信息

		// 首先居中centerIndex的图片
		imgsArrangeCenterArr[0] = {
			pos: centerPos,
			rotate: 0, // 旋转角度
			isCenter: true, // 是否居中
			isInverse: false // 图片正反面			
		};

		//取出要布局上侧的图片的状态信息
		let imgsArrangeTopArr = []; // 存储放在上边区域的图片状态信息
		let topImgNum = Math.floor(Math.random() * 2); //取0张或一张

		// 取出要布局上侧图片的位置信息
		let topImgSpliceIndex = 0; //从哪个index开始取图片
		while (centerIndex === topImgSpliceIndex) {
			topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
		}
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

		// 布局位于上侧的图片
		imgsArrangeTopArr.forEach(function(val, index) {
			imgsArrangeTopArr[index] = {
				pos: {
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]), // 调用上面的在区间内取随机数的函数
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
				},
				rotate: get30DegRandom(),
				isInverse: false,
				isCenter: false
			};
		});

		// 布局左右两侧的图片
		for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
			let hPosRangeLOrRX = null; // 左或右侧的取值范围

			// 前半部分布局左边，右半部份布局右边
			if (i < k) {
				hPosRangeLOrRX = hPosRangeLeftSecX;
			} else {
				hPosRangeLOrRX = hPosRangeRightSecX;
			}


			imgsArrangeArr[i] = {
				pos: {
					left: getRangeRandom(hPosRangeLOrRX[0], hPosRangeLOrRX[1]),
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1])
				},
				rotate: get30DegRandom(),
				isInverse: false,
				isCenter: false
			};
		}
		// 把取出来的上边的图片位置信息放回去
		if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
			imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
		}

		imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

		this.setState({
			imgsArrangeArr: imgsArrangeArr
		});

	}

	//组件加载以后，为每张图片计算其位置范围
	componentDidMount() {
		// 首先拿到舞台的大小
		// this: 指GalleryByReactApp这个组件
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage); // 取得舞台这个元素
		let stageW = stageDOM.scrollWidth;
		let stageH = stageDOM.scrollHeight;
		let halfStageW = Math.floor(stageW / 2);
		let halfStageH = Math.floor(stageH / 2);
		// console.log(stageW)

		// 拿到一张图片的大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.floor(imgW / 2),
			halfImgH = Math.floor(imgH / 2);

		// 中央图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}

		//左右两部分的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		//上部分的取值范围
		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

		// console.log(this)

		// console.log(this)
		this.rearRange(0);
	}

	render() {
		let controllerUnits = [], // 定义导航点数组			
			imgFigures = []; // 定义图片数组，遍历图片信息，把图片信息增加到数组里

		imageDatas.forEach(function(item, index) {
			// 图片的初始位置
			if (!this.state.imgsArrangeArr[index]) {
				this.state.imgsArrangeArr[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				}
			}
			//data: 定义ImgFigure的属性，可以随便定义：test\dat都行
			//把函数内部的this指向函数外部的this(component对象实例)
			imgFigures.push(
				<ImgFigure
		          key={index}
		          data={item}
		          ref={'imgFigure' + index}		          
		          arrange={this.state.imgsArrangeArr[index]}
		          inverse={this.inverse(index)}
		          center={this.center(index)}
		        />
			);

			controllerUnits.push(
				<ControllerUnit 
				key={index} 
				arrange={this.state.imgsArrangeArr[index]}
				inverse={this.inverse(index)}
				center={this.center(index)}
			/>);

		}.bind(this))

		return (
			<section className="stage" ref="stage">
		        <section className="img-sec">
		          {imgFigures}
		        </section>
		        <nav className="controller-nav">
		          {controllerUnits}
		        </nav>
      		</section>
		);
	}
}

let ControllerUnit = React.createClass({
	// 控制组件点击处理函数
	handleClick(e) {
		if (!this.props.arrange.isCenter) {
			this.props.center();
		} else {
			this.props.inverse();
		}
		e.stopPropagation();
		e.preventDefault();
	},

	render: function() {
		let controllerUnitsClassName = 'controller-unit';
		controllerUnitsClassName += (this.props.arrange.isCenter) ? ' is-center' : '';
		controllerUnitsClassName += (this.props.arrange.isInverse) ? ' is-inverse' : '';
		return (
			<span className={controllerUnitsClassName} onClick={this.handleClick}></span>
		);
	}
})
let ImgFigure = React.createClass({
	// imgFigure的点击函数
	handleClick(e) {
		// 如果图片是居中，则翻转；否则则居中该图片
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else {
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	},
	render() {
		let styleObj = {};

		// 如果props属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		// 设置居中图片的层叠在其他图片上面
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 3;
		}


		// 如果图片旋转角度有值且不为0
		if (this.props.arrange.rotate) {
			(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(val) {
				styleObj[val] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}
		let imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}
});

AppComponent.defaultProps = {};

export default AppComponent;