import React from 'react'
import videojs from 'video.js'
import PropTypes from 'prop-types';

import { getIPFSURL, getIPFSImage, getFileExtension } from '../../utils.js'

import 'video.js/dist/video-js.css'
import './assets/VideoPlayer.css'

class VideoPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.defaultVideoOptions = {
	        poster: "",
	        sources: [{src: "", type: "video/mp4"}],
	        controls: true,
	        preload: "auto",
	        fluid: true,
	        autoplay: false
        };

		let videoOptions = this.props.options ? {...this.defaultVideoOptions, ...this.props.options} : this.defaultVideoOptions;

        this.state = {
	        options: videoOptions,
	        Artifact: undefined,
	        ArtifactFile: undefined,
	        lockFile: undefined,
	        textTrack: []
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
	    let options = prevState.options, textTrack = [];
	    if (nextProps.ArtifactFile !== prevState.ArtifactFile || nextProps.Artifact !== prevState.Artifact ||
		    nextProps.lockFile !== prevState.lockFile || nextProps.usePosterFile !== prevState.usePosterFile) {
	    	if (nextProps.ArtifactFile && nextProps.Artifact) {
			    if (!nextProps.usePosterFile) {
				    options.sources[0].src = getIPFSURL(nextProps.Artifact, nextProps.ArtifactFile) + "#t=10";
				    options.poster = "";
			    } else {
				    options.poster = getIPFSImage(nextProps.Artifact);
				    options.sources[0].src = getIPFSURL(nextProps.Artifact, nextProps.ArtifactFile);
			    }

			    let tmpObj = {};
			    let files = nextProps.Artifact.getFiles();
			    for (let file of files) {
				    let ext = getFileExtension(file);
				    if (ext === 'vtt') {
					    tmpObj["src"] = getIPFSURL(nextProps.Artifact, file);
					    tmpObj["kind"] = "subtitles";
					    tmpObj["srclang"] = "en";
					    tmpObj["label"] = "English";
					    textTrack.push(tmpObj)
				    }
			    }
		    } else {
	    		options = {...options, sources: [{}], poster: ""}
		    }
		    options.controls = !nextProps.lockFile;
	    	options.autoplay = !!(prevState.lockFile && !nextProps.lockFile);
	    }
	    return {
	    	options,
		    Artifact: nextProps.Artifact,
		    ArtifactFile: nextProps.ArtifactFile,
		    lockFile: nextProps.lockFile,
		    textTrack,
		    usePosterFile: nextProps.usePosterFile
	    }
    }

    componentDidMount() {
	    // instantiate Video.js
	    this.player = videojs(this.videoNode, this.state.options, function onPlayerReady() {
		    //doSomething
	    });
	    this.setState({player: this.player})

    }

	componentDidUpdate(prevProps, prevState){
    	if (prevState !== this.state) {
		    if (this.player) {
			    this.player.src(this.state.options.sources);
			    this.player.poster(this.state.options.poster);
		    	if (this.state.Artifact && this.state.ArtifactFile) {
				    this.player.autoplay(this.state.options.autoplay);
				    this.player.controls(this.state.options.controls);
				    for (let textTrackObject of this.state.textTrack) {
					    this.player.addRemoteTextTrack(textTrackObject, true)
				    }
			    } else {
		    		this.player.reset()
			    }
		    }
	    }
	}

    // destroy player on unmount @ToDo: Uncomment when not testing in storybook
    // componentWillUnmount() {
    //     if (this.player) {
    //         this.player.dispose()
    //     }
    // }

    render() {
        return (
            <div data-vjs-player className="videojs-container">
                <video ref={node => this.videoNode = node} className="video-js vjs-oip vjs-big-play-centered">
                    <p className="vjs-no-js">
                        To view this video please enable JavaScript, and consider upgrading to a
                        web browser that
                        <a href="http://videojs.com/html5-video-support/" target="_blank">
                            supports HTML5 video
                        </a>
                    </p>
                </video>
            </div>
        )
    }
}

VideoPlayer.SUPPORTED_FILE_TYPES = ["mp4"];
VideoPlayer.propTypes = {
    Artifact: PropTypes.object,
    ArtifactFile: PropTypes.object,
    style: PropTypes.object,
    options: PropTypes.object,
	lockFile: PropTypes.bool,
	usePosterFile: PropTypes.bool
};

export default VideoPlayer