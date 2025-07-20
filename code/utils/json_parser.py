import json
import re
from json_repair import repair_json

class JsonParsingError(Exception):
    pass

def extract_json_block_fenced(text: str) -> str | None:
    """Extracts the content of a ```json fenced code block."""
    match = re.search(r"(?i)```json\s*(\{.*\})\s*```", text, re.DOTALL)
    if match:
        potential_json = match.group(1)
        if potential_json.count('{') == potential_json.count('}'):
            return potential_json
    return None

def extract_json_block_balanced(text: str) -> str | None:
    """Finds the largest balanced JSON-looking block from first '{' to last '}'."""
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end > start:
        return text[start:end+1]
    return None

def validate_required_keys(obj: dict, required_keys: list[str]):
    """Ensures all required keys exist in the parsed dictionary."""
    for key in required_keys:
        if key not in obj:
            raise JsonParsingError(f"Missing required key: {key}")

def _parse_and_validate(raw_json: str, required_keys: list[str] = None) -> dict:
    """Helper to parse and optionally validate required schema."""
    parsed = json.loads(raw_json)
    if required_keys:
        validate_required_keys(parsed, required_keys)
    return parsed

def parse_llm_json(text: str, required_keys: list[str] = None, debug: bool = False) -> dict:
    """
    Attempts to robustly parse a JSON object from LLM output.
    Tries:
      1. fenced JSON
      2. balanced braces
      3. enhanced markdown cleaning
      4. repaired JSON
    """
    # Enhanced markdown cleaning for responses wrapped in markdown
    cleaned_text = text.strip()
    
    # Remove markdown code blocks more aggressively
    if cleaned_text.startswith("```json"):
        cleaned_text = cleaned_text[7:]  # Remove ```json
    elif cleaned_text.startswith("```"):
        cleaned_text = cleaned_text[3:]  # Remove ```
    
    if cleaned_text.endswith("```"):
        cleaned_text = cleaned_text[:-3]  # Remove trailing ```
    
    cleaned_text = cleaned_text.strip()
    
    extractors = [
        ("fenced", extract_json_block_fenced),
        ("balanced", extract_json_block_balanced)
    ]

    for name, extractor in extractors:
        raw_json = extractor(cleaned_text)
        if raw_json:
            try:
                if debug: print(f"[DEBUG] Attempting {name} extraction...")
                return _parse_and_validate(raw_json, required_keys)
            except json.JSONDecodeError:
                if debug: print(f"[DEBUG] JSON decode failed for {name}.")
                continue
            except JsonParsingError:
                raise  # Required key missing

    # Enhanced extraction: try to find JSON content between the first { and last }
    start = cleaned_text.find("{")
    end = cleaned_text.rfind("}")
    
    if start != -1 and end > start:
        json_content = cleaned_text[start:end+1]
        try:
            if debug: print(f"[DEBUG] Attempting enhanced JSON extraction...")
            return _parse_and_validate(json_content, required_keys)
        except json.JSONDecodeError:
            if debug: print(f"[DEBUG] Enhanced extraction failed.")
        except JsonParsingError:
            raise  # Required key missing

    # Final attempt: repair
    raw_json = extract_json_block_balanced(cleaned_text)
    if raw_json:
        try:
            if debug: print(f"[DEBUG] Attempting auto-repair...")
            repaired = repair_json(raw_json)
            return _parse_and_validate(repaired, required_keys)
        except Exception:
            if debug: print(f"[DEBUG] Repair attempt failed.")

    raise JsonParsingError("All attempts to parse JSON from LLM output failed.")
