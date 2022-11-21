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
  track: AppData<SpotifyTrack>;
  showDetail: Function;
}

interface SpotifyResultDetailTrackState {
    album?: AppData<SpotifyAlbum>;
}

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
                    <div>
                        <div>
                            <h2 onClick={this.clickedAlbum.bind(this)}>{this.props.track.meta.album.name} (Album)</h2>
                            <img className="spotify_result-detail--image" src={this.props.track.meta.album.images[0].url} onClick={this.clickedAlbum.bind(this)} /> 
                        </div>
                        <div>
                            <h3>Album Released</h3>
                            {this.props.track.meta.album.release_date}
                        </div>
                        <div>
                            <h3>Artist</h3>
                            <a onClick={this.clickedArtist.bind(this)}>{this.props.track.meta.artists[0].name}</a>
                        </div>
                    </div> 
                    <div className="search-result-detail-artist--content" onScroll={this.handleScroll} onWheel={this.handleScroll} >         
                        <h2>{this.props.track.name} (Song)</h2>                                
                        <div>Duration: {formattedDuration}</div>
                        <div>Track Number: {this.props.track.meta.track_number}</div>                        
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


    clickedArtist(event: React.UIEvent) {
        let id = this.props.track.meta.artists[0].id;
        getArtist( id ).then( (artist:SpotifyArtist) => {                           
            var detail = <SpotifyResultDetailArtist artist={mapArtist(artist)} showDetail={this.props.showDetail} />;
            this.props.showDetail( detail );
        });
    }

    clickedAlbum() {
        getAlbum( this.props.track.parent_id ).then( (res:SpotifyAlbum) => {           
            var detail = <SpotifyResultDetailAlbum album={mapAlbum(res)} showDetail={this.props.showDetail} />;
            this.props.showDetail( detail );
        });
    }
 
    handleScroll(event: React.MouseEvent<HTMLDivElement>) {
        event.stopPropagation();
        return false;
    }
}
