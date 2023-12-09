import {Component, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {Question} from "../../core/interfaces/question";
import {AudioService} from "../../services/audio.service";
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common"; // A service you should create to manage audio playback

@Component({
  selector: 'app-question-display',
  templateUrl: './question-display.component.html',
  styleUrls: ['./question-display.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    NgClass
  ]
})
export class QuestionDisplayComponent {
  @Input() question!: Question;
  @Output() scoreUpdate = new EventEmitter<number>();
  @Output() timeOut = new EventEmitter<void>();
  @Output() nextQuestionEmit = new EventEmitter<void>();
  @Output() textAnswerSubmit = new EventEmitter<string>();


  @ViewChild('audioPlayer', {static: false}) audioPlayer!: ElementRef;


  answerSelected: boolean = false;
  countdown: number | null = null;
  interval: any;
  textAnswer: string = '';
  selectedAnswer: number | null= null;
  isQuestionAnswered: boolean = false;
  isWinOverlayDisplay: boolean = false;

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    /*this.audioService.playSnippet(this.question.songSnippetPath, this.question.startTime, this.question.duration);
    this.audioService.snippetEnded$.subscribe(() => {
      // Snippet has ended, start the countdown timer here
      this.startCountdown(30);
    });*/
  }

  ngAfterViewInit() {
    const audio = this.audioPlayer.nativeElement;
    audio.src = this.question.songSnippetPath;

    audio.onloadeddata = () => {
      // audio loaded, can play now
      console.log('loaded');
      audio.currentTime = this.question.startTime;



    }
  }
  startCountdown(duration: number) {
    this.countdown = duration;
    this.interval = setInterval(() => {
      this.countdown = this.countdown as number - 1;
      if (this.countdown <= 0) {
        clearInterval(this.interval);
        this.timeOut.emit();
      }
    }, 1000);
  }

  onOptionSelected(optionIndex: number ) {
    this.selectedAnswer = optionIndex;
  }

  onOptionSubmit(optionIndex: number | null) {
    clearInterval(this.interval); // Stop countdown
    this.answerSelected = true;

    if (optionIndex === this.question.correctOptionIndex) {
      this.scoreUpdate.emit(this.question.points);
      this.isWinOverlayDisplay = true;
    } else {
      this.scoreUpdate.emit(0); // Send zero points if wrong answer
    }

    this.isQuestionAnswered = true;
  }

  onTextAnswerSubmit() {
    // When user submits their text answer, emit the result
    this.textAnswerSubmit.emit(this.textAnswer);
    this.textAnswer = ''; // Clear the textbox after submission
  }

  isOptionRemoved(index: number): boolean {
    return this.question.options && this.question.options[index] === null;
  }

  ngOnDestroy() {
    clearInterval(this.interval); // Make sure we clean up the interval when the component is destroyed
    this.audioService.cleanup(); // Cleanup the audio service resources

  }

  stopPlayback(audio : any) {
    audio.pause();
    // audio.currentTime = 0; // Reset the playback to the beginning
    // Note: The 'onended' event will trigger here as we pause the audio
    this.startCountdown(5)
  }

  playPlayback() {

    const audio = this.audioPlayer.nativeElement;

    audio.play();

    // Set a timeout to stop playback when the snippet duration ends
    setTimeout(() => this.stopPlayback(audio), this.question.duration * 1000);

  }

  nextQuestion() {
    const audio = this.audioPlayer.nativeElement;
    this.stopPlayback(audio);
    this.nextQuestionEmit.emit();
  }

  hideWinOverlay() {
    this.isWinOverlayDisplay = false;
  }
}
