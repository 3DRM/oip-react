import React from 'react';
import PropTypes from 'prop-types';

import { getFileExtension } from '../utils'

import VideoPlayer from './VideoPlayer/VideoPlayer';
import ImageViewer from './ImageViewer/ImageViewer'
import AudioPlayer from './AudioPlayer'

let FileViewers = [
	VideoPlayer,
	ImageViewer,
	AudioPlayer
];

class FileViewer extends React.Component {
	render() {
		let FileViewerComponent, extension;
		if (this.props.ArtifactFile) {extension = getFileExtension(this.props.ArtifactFile)}

		if (extension) {
			for (let Viewer of FileViewers) {
				if (Viewer.SUPPORTED_FILE_TYPES) {
					for (let supportedFileType of Viewer.SUPPORTED_FILE_TYPES) {
						if (extension === supportedFileType) {
							FileViewerComponent = React.createElement(Viewer,
								{
									Artifact: this.props.Artifact,
									ArtifactFile: this.props.ArtifactFile,
									lockFile: this.props.lockFile
								})
						}
					}
				}
			}
		}

		if (!FileViewerComponent){
			FileViewerComponent = <div style={{backgroundColor: "black"}}><h1 style={{color: "#fff", textAlign: "center", marginTop: "10%"}}>Unsupported File Format (.{extension})</h1></div>;
		}
		return FileViewerComponent
	}
}

FileViewer.propTypes = {
	Artifact: PropTypes.object,
	ArtifactFile: PropTypes.object
};


export default FileViewer