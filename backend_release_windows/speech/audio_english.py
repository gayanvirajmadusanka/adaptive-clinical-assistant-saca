"""
Module for converting English audio to text using Whisper.
Runs fully offline without requiring an API key.
"""

import os

import whisper

_MODEL = None


def _get_model(size: str = "base"):
    """
    Load Whisper model if not already loaded.
    :param size: model size to load.
    :return: loaded Whisper model instance.
    """
    global _MODEL
    if _MODEL is None:
        print(f"Loading Whisper model ({size})...")
        _MODEL = whisper.load_model(size)
        print("Whisper model loaded")
    return _MODEL


def transcribe(audio_path: str, model_size: str = "base") -> dict:
    """
    Transcribe English audio file to text.
    :param audio_path: path to audio file (.wav, .mp3, .m4a).
    :param model_size: whisper model size.
    :return: dict with transcription result and metadata.
    """
    if not os.path.exists(audio_path):
        return {
            "success": False,
            "text": None,
            "error": f"Audio file not found: {audio_path}"
        }

    model = _get_model(model_size)

    result = model.transcribe(
        audio_path,
        language="en",
        fp16=False,
        verbose=False
    )

    text = result["text"].strip()

    # compute confidence from segment-level no_speech_prob
    segments = result.get("segments", [])
    if segments:
        avg_no_speech = sum(s["no_speech_prob"] for s in segments) / len(segments)
        confidence = round(1 - avg_no_speech, 3)
    else:
        confidence = None

    return {
        "success": True,
        "text": text,
        "confidence": confidence,
        "language": result.get("language", "en"),
        "input_type": "audio_english",
        "segments": [
            {
                "start": segment["start"],
                "end": segment["end"],
                "text": segment["text"].strip()
            }
            for segment in segments
        ]
    }
