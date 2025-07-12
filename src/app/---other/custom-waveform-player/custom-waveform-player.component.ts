import { Component } from '@angular/core';
import { WaveformPlayerComponent } from "./waveform-player/waveform-player.component";

@Component({
  selector: 'app-custom-waveform-player',
  imports: [WaveformPlayerComponent],
  templateUrl: './custom-waveform-player.component.html',
  styleUrl: './custom-waveform-player.component.scss'
})
export class CustomWaveformPlayerComponent {

}
