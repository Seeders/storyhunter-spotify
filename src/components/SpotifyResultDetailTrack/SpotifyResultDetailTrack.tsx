import * as React from "react";
import getClassName from "../../utils/GetClassName";
import { AppData } from "../../App";
import SpotifyResultDetailAlbum from "../SpotifyResultDetailAlbum/SpotifyResultDetailAlbum";
import SpotifyResultDetailArtist from "../SpotifyResultDetailArtist/SpotifyResultDetailArtist";
import { SpotifyAlbum, SpotifyTrack, SpotifyArtist, mapAlbum, mapArtist } from "../../models/SpotifyModels";
import { getAlbum, getArtist } from "../../api/SpotifyAPI";
import { formatDuration } from "../../utils/Time";

require("./SpotifyResultDetailTrack.css");

interface SpotifyResultDetailTrackProps {
  className?: string;
  children?: React.ReactNode;
  track: AppData<SpotifyTrack>; //track data to display details for
  showDetail: Function; //call this with one of the detail panes to show the pane.
}

interface SpotifyResultDetailTrackState {
    album?: AppData<SpotifyAlbum>;
}

/**
 * Detail Pane to show Track information.
 **/
export default class SpotifyResultDetailTrack extends React.Component<SpotifyResultDetailTrackProps, SpotifyResultDetailTrackState> {

    mainClass : string = "search-result-detail-track";
    state: SpotifyResultDetailTrackState;
    constructor( props: SpotifyResultDetailTrackProps ) {
        super(props); 
    
        this.state = {
            album: undefined
        };
    
    }
    render() {

        if( this.state.album ) {
            let formattedDuration = formatDuration( this.props.track.meta.duration_ms );
            return (
                <div className={getClassName(this.mainClass, this.props.className)}>
                    <div className="spotify_result-detail--breadcrumb">
                        <a tabIndex={0} onClick={this.clickedArtist.bind(this)}>{this.props.track.meta.artists[0].name}</a> - <span className="spotify_text-parenthesis">(Artist)</span><br /> 
                        &emsp; <a tabIndex={0} onClick={this.clickedAlbum.bind(this)}>{this.props.track.meta.album.name}</a> - <span className="spotify_text-parenthesis">(Album)</span><br /> 
                        &emsp;&emsp;&gt; <span>{this.props.track.name}</span> - <span className="spotify_text-parenthesis">(Track #{this.props.track.meta.track_number})</span>
                    </div>
                    <div className={getClassName(`${this.mainClass}--content`)} >         
                        <h2>{this.props.track.name}</h2>                                
                        <p>Duration: {formattedDuration}</p>
                        <p>Track Number: {this.props.track.meta.track_number}</p>  
                        <p><a className={getClassName('result-detail--play-button')} href={this.props.track.meta.uri}>Play Now</a></p>                        
                    </div>  
                    <div>
                        <div>
                            <h3 onClick={this.clickedAlbum.bind(this)}>{this.props.track.meta.album.name}</h3>
                            <img className={getClassName('result-detail--image')} src={this.props.track.meta.album.images[0].url} onClick={this.clickedAlbum.bind(this)} /> 
                        </div>
                        <div>
                            <h3>Album Released</h3>
                            {this.props.track.meta.album.release_date}
                        </div>
                    </div>                      
                </div>
            );
        } else {
            this.loadAlbums();
        }
    }

    loadAlbums() {
        getAlbum( this.props.track.parent_id ).then( ( res: SpotifyAlbum ) => {            
            this.setState( { album: mapAlbum(res) } );
        });
    }

    /**
     * When a user clicks an artist, call this.props.showDetail with a new Artist detail pane.  
     **/
    clickedArtist(event: React.UIEvent) {
        let id = this.props.track.meta.artists[0].id;
        getArtist( id ).then( (artist:SpotifyArtist) => {                           
            var detail = <SpotifyResultDetailArtist artist={mapArtist(artist)} showDetail={this.props.showDetail} />;
            this.props.showDetail( detail );
        });
    }

    /**
     * When a user clicks an album, call this.props.showDetail with a new Album detail pane.  
     **/
    clickedAlbum() {
        getAlbum( this.props.track.parent_id ).then( (res:SpotifyAlbum) => {           
            var detail = <SpotifyResultDetailAlbum album={mapAlbum(res)} showDetail={this.props.showDetail} />;
            this.props.showDetail( detail );
        });
    }
 

}
