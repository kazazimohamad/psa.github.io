import {Component, Input} from '@angular/core';
import {Question} from "../../core/interfaces/question";
import {QuestionDisplayComponent} from "../question-display/question-display.component";
import {NgForOf, NgIf} from "@angular/common";
import {DataService} from "../../services/data.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    QuestionDisplayComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  providers: [
  ]
})
export class GameComponent {
  score: number = 0;
  currentLevel: number = 1;
  questions!: Question[]; // This should be populated with your actual questions data
  currentQuestion!: Question;
  lifelines: boolean[] = [false]; // Tracks which lifelines have been used
  isGameEnded: boolean = false;

  @Input() id!: string;

  constructor(
    private dataService: DataService
  ) {

  }

  ngOnInit() {
    this.loadQuestions();
    console.log(this.id)
  }
  loadQuestions() {

    // Load the questions from a JSON file or a service
    // For demonstration purposes, this is just a placeholder
    this.dataService.getData(this.id + '.json').subscribe( data => {
      // In real scenario, it might be loaded from a service
      this.questions = data.questions
      this.currentQuestion = this.questions[this.currentLevel - 1]; // Levels are 1-indexed

    });
  }

  updateScore(points: number): void {
    this.score += points;
    // Move to next level, if there are more levels
    /*if (this.currentLevel < this.questions.length) {
      this.currentLevel++;
      this.currentQuestion = this.questions[this.currentLevel - 1];
    } else {
      // Handle end of game
    }*/
  }


  nextQuestionHandler() {
    this.moveToNextLevel();
  }

  moveToNextLevel(): void {
    // Move to next level, if there are more levels
    if (this.currentLevel < this.questions.length) {
      this.currentLevel++;
      this.currentQuestion = this.questions[this.currentLevel - 1];
    } else {
      this.isGameEnded = true;
    }
  }


  useLifeline(index: number): void {
    if (this.currentQuestion.type === 'choice') { // ensure this is not a text question
      const optionsToRemove = index + 1; // 0 = remove 1, 1 = remove 2, 2 = remove 3 options
      if (!this.lifelines[index]) {
        this.lifelines[index] = true; // Mark lifeline as used
        this.removeIncorrectOptions(optionsToRemove);
      }
    }
  }

  private removeIncorrectOptions(optionsToRemove: number) {
    const incorrectOptionsIndices = this.currentQuestion.options
      .map((option, index) => index !== this.currentQuestion.correctOptionIndex ? index : -1)
      .filter(index => index !== -1);

    for(let i = 0; i < optionsToRemove; i++) {
      // Selected an index to remove
      const removeIndex = incorrectOptionsIndices.splice(Math.floor(Math.random() * incorrectOptionsIndices.length), 1)[0];
      if (removeIndex !== undefined) {
        if(this.currentQuestion?.options && removeIndex) {
        this.currentQuestion.options[removeIndex] = ''; // Set the option to null (or any marker to indicate removal)

        }
      }
    }
  }


}
