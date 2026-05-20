"""
English ASR using faster-whisper (tiny int8).
Drop-in replacement for openai-whisper that runs on Android ARM64.
faster-whisper uses CTranslate2 which has prebuilt Android ARM64 wheels.
"""

import os

_MODEL = None
_FASTER_WHISPER_AVAILABLE = True

try:
    from faster_whisper import WhisperModel as _WhisperModel  # noqa: F401
except ImportError:
    _FASTER_WHISPER_AVAILABLE = False


def _get_model():
    global _MODEL
    if _MODEL is None:
        from faster_whisper import WhisperModel
        print("Loading Whisper tiny model (int8)...")
        _MODEL = WhisperModel("tiny", device="cpu", compute_type="int8")
        print("Whisper model loaded")
    return _MODEL


def transcribe(audio_path: str, model_size: str = "tiny") -> dict:
    if not os.path.exists(audio_path):
        return {"success": False, "text": None, "error": f"Audio file not found: {audio_path}"}

    if not _FASTER_WHISPER_AVAILABLE:
        return {"success": False, "text": None,
                "error": "faster-whisper not installed (Android-only dependency)"}

    model = _get_model()

    segments_gen, info = model.transcribe(audio_path, language="en", vad_filter=True)
    segments = list(segments_gen)

    text = " ".join(s.text for s in segments).strip()

    if segments:
        avg_no_speech = sum(getattr(s, "no_speech_prob", 0.0) for s in segments) / len(segments)
        confidence = round(1 - avg_no_speech, 3)
    else:
        confidence = None

    return {
        "success": True,
        "text": text,
        "confidence": confidence,
        "language": getattr(info, "language", "en"),
        "input_type": "audio_english",
        "segments": [
            {"start": s.start, "end": s.end, "text": s.text.strip()}
            for s in segments
        ]
    }
