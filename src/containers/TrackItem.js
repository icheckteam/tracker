import React, { Component } from 'react';
import { Timeline, TimelineEvent } from '../components/Timeline';
import { Media, OverlayTrigger, Tooltip} from 'react-bootstrap';
import  parsing from '../parsing';
import { getPropertyValue } from '../utils/assets'
import { Link } from "react-router-dom";
const styles = {
  historyTitle: {
    padding: 10,
  },

  header: {
    padding: 10,
    background: "#f9f9f9"
  },


  text: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: 50,
    display: "inline-flex"
  }
}


const propertyNameToVietnamese = {
  "location": "Vị trí",
  "weight": "Cân nặng"
}

const _formatPropertyName =  (name) => {
  if (propertyNameToVietnamese[name]) {
    return propertyNameToVietnamese[name];
  }
  return name;
}


const _formatValue = (asset, propName) => {
  let prop = getPropertyValue(asset, propName)
  if (prop) {
    return parsing.stringifyValue(parsing.floatifyValue(prop), '***', propName)
  } else {
    return 'N/A'
  }
}

const _formatLocation = (location) => {
  if (location && location.latitude !== undefined && location.longitude !== undefined) {
    let latitude = parsing.toFloat(location.latitude)
    let longitude = parsing.toFloat(location.longitude)
    return `${latitude}, ${longitude}`
  } else {
    return 'Unknown'
  }
}



class TrackItem extends Component {

  renderTx = (tx, index) => {
    const { asset } = this.props;
    const msg  = tx.tx.value.msg.value;
    const msgType = tx.tx.value.msg.type;
    let timelineEvent;
    switch (msgType) {
      case '8E4151824E2B80':
        var text = "";
        if (msg.parent && msg.parent !== asset.id) {
          text = (<span>từ <div style={styles.text}><Link to={"/track/" + msg.parent}>{msg.parent}</Link></div></span>)
        } else if (msg.parent == asset.id) {
          text = (<span>đến <div style={styles.text}><Link to={"/track/" + msg.asset_id}>{msg.asset_id}</Link></div></span>)
        }

        timelineEvent =  (
          <TimelineEvent title="Đăng ký tài sản"
            createdAt={parsing.formatTimestamp(msg.time)}
            icon={<i className="material-icons md-18">create</i>}
            >
            <div style={styles.text}><a title={msg.sender}>{msg.sender}</a></div> đã đăng ký tài sản mới số lượng {parsing.toFloat(msg.quantity)} kg {text}
          </TimelineEvent> 
        )
      break;
      case '06F6C30F9E7CF0':
        timelineEvent =  (
          <TimelineEvent title="Báo cáo"
            createdAt={parsing.formatTimestamp(msg.time)}
            icon={<i className="material-icons md-18">report</i>}
            >
            <div style={styles.text}><a title={msg.sender}>{msg.sender}</a></div> đã báo cáo &nbsp;
            {msg.properties.map((property, index) => {
              return (<span key={index}>{_formatPropertyName(property.name)}: {_formatValue(msg, property.name)}, </span>)
            })}
          </TimelineEvent>)
      break;
      case '241AA14E79D880':
        timelineEvent =  (
          <TimelineEvent title="Thêm nguyên liệu"
            createdAt={parsing.formatTimestamp(msg.time)}
            icon={<i className="material-icons md-18">add</i>}
            >
            <div style={styles.text}><a title={msg.sender}>{msg.sender}</a></div> đã thêm &nbsp;
            {msg.materials.map((material, index) => {
              var to = "";
              if (asset.id === material.asset_id) {
                to = (<span>đến <div style={styles.text}><Link to={"/track/" + msg.asset_id}>{msg.asset_id}</Link></div></span>)
              }
              return (<span key={index}> <Link to={"/track/" + material.asset_id}>{material.asset_id}</Link>: {parsing.toFloat(material.quantity)} KG {to}, </span>)
            })}
          </TimelineEvent>)
      break;
      case '304553E545EF80':
        timelineEvent =  (
          <TimelineEvent title="Chuyển nhượng"
            createdAt={parsing.formatTimestamp(msg.time)}
            icon={<i className="material-icons md-18">reply_all</i>}
            >
            <div style={styles.text}><a>{msg.sender}</a></div> &nbsp; đã chuyển cho   &nbsp;
            <div style={styles.text}><a>{msg.recipient}</a></div>
          </TimelineEvent>)
      break;
      case 'AD218BD2955E28':
        timelineEvent =  (
          <TimelineEvent title="Cập nhật số lượng"
            createdAt={parsing.formatTimestamp(msg.time)}
            icon={<i className="material-icons md-18">reply_all</i>}
            >
            <div style={styles.text}><a>{msg.sender}</a></div> &nbsp; đã thêm số lương  {parsing.toFloat(msg.quantity)} KG
          </TimelineEvent>)
      break;
      default:
        timelineEvent =  (
          <TimelineEvent title="Unknown"
            createdAt={parsing.formatTimestamp(msg.time)}
            icon={<i className="material-icons md-18">unknown</i>}
            >
            {msgType}
          </TimelineEvent>
        )
      break;
    }

    return (<div key={index}>{timelineEvent}</div>)
  }

  render() {
    const { asset } = this.props;
    return (
      <div className="track-view">
        <div className="border-bottom" style={styles.header}>
          <Media>
            <Media.Left>
              <img width={64} height={64} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCc0k2RjC46q1lxbsFAOTQojfz_eizDWiaomU74umfiQjaYhnF" alt="thumbnail" />
            </Media.Left>
            <Media.Body>
              <Media.Heading>{asset.name}</Media.Heading>
              <div>Mã theo dõi: <em><a>{asset.id}</a></em></div>
              <div>Vị trí hiện tại: <em><a>{_formatLocation(asset, "location")}</a></em></div>
              <div>Nhiệt độ: <em><a>{_formatValue(asset, "temperature")}</a></em></div>
              <div>Khối lượng: <em><a>{_formatValue(asset, "weight")}</a></em></div>
              <div>Số lượng: <em><a>{parsing.toFloat(asset.quantity)} con</a></em></div>
              <div>Chủ sở hữu: <em><a><div style={{...styles.text, maxWidth: 120}}>{asset.owner}</div></a></em></div>
            </Media.Body>
          </Media>

          {asset.materials ? (
            <div className="clearfix material-list">
            <ul>
              {asset.materials.map((material, index) => {
                const tooltip = (
                  <Tooltip id="tooltip">
                    <strong>{material.name}</strong> {parsing.toFloat(material.quantity)} kg
                  </Tooltip>
                );                
                return (<li key={index}>
                  <OverlayTrigger placement="left" overlay={tooltip}>
                    <Link to={"/track/" + material.id}>
                      <img src="https://image.flaticon.com/icons/png/128/311/311537.png" alt={material.name}/>
                    </Link>
                  </OverlayTrigger>
              </li>)
              })}
            </ul>
          </div>
          ): ""}
        </div>


        <h4 style={styles.historyTitle}>Lịch sử cập nhật</h4>

        <Timeline>
            {asset.txs.map(this.renderTx)}
        </Timeline>
      </div>
    );
  }
}

export default TrackItem