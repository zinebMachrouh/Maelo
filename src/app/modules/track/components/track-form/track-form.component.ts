import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MusicCategory } from '../../models/enums/MusicCategory';
import {Track} from '../../models/track.model';

@Component({
  selector: 'app-track-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './track-form.component.html',
  standalone: true,
  styleUrls: ['./track-form.component.scss']
})
export class TrackFormComponent implements OnChanges {
  @Input() categories: MusicCategory[] = Object.values(MusicCategory) as MusicCategory[];
  @Input() isVisible = false;
  @Input() track: Track | null = null;
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  trackForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.trackForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      artist: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.minLength(3), Validators.maxLength(500)]],
      category: ['', Validators.required],
      image: ['', [Validators.required]],
      audio: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['track'] && this.track) {
      this.trackForm.patchValue(this.track);
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.trackForm.valid) {
      const trackData = this.trackForm.value;
      const audioFile = this.trackForm.get('audio')?.value;
      const coverImage = this.trackForm.get('image')?.value;

      this.save.emit({ trackData, audioFile, coverImage });

    }
  }

  /**
   * Custom Validator for Image File
   * - Accepted formats: PNG, JPEG
   */
  private imageValidator(control: any): { [key: string]: any } | null {
    const file = control.value as File;
    if (!file) return null;

    const validExtensions = ['image/png', 'image/jpeg'];
    if (!validExtensions.includes(file.type)) {
      return { invalidImageFormat: true };
    }
    return null;
  }

  /**
   * Custom Validator for Audio File
   * - Max size: 15MB
   * - Accepted formats: MP3, WAV, OGG
   */
  private audioValidator(control: any): { [key: string]: any } | null {
    const file = control.value as File;
    if (!file) return null;

    const validExtensions = ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    const maxSize = 15 * 1024 * 1024; // 15MB

    if (!validExtensions.includes(file.type)) {
      return { invalidAudioFormat: true };
    }

    if (file.size > maxSize) {
      return { invalidAudioSize: true };
    }

    return null;
  }

  onFileChange(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.trackForm.get(field)?.setValue(file);
    } else {
      this.trackForm.get(field)?.setValue('');
    }
  }

}
