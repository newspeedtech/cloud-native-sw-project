

min = 34
max = 126
span = max - min + 1

def validate_parameters(inputText: str, N: int, D: int) -> int:    
    if not isinstance(inputText, str):
        return 1
    if not isinstance(N, int):
        return 2
    if not isinstance(D, int):
        return 3
    if N < 1:
        return 4
    if D not in (1, -1):
        return 5
    for i, c in enumerate(inputText):
        asciiValue = ord(c)
        if asciiValue < 34 or asciiValue > 126:
            return 6
    return 0

def error_code_to_message(code: int) -> None:
    error_messages = {
        1: "inputText must be a string",
        2: "N must be an integer",
        3: "D must be an integer",
        4: "N must be >= 1",
        5: "D must be either +1 (right) or -1 (left)",
        6: "invalid character in inputText"
    }
    if code != 0:
        raise ValueError(error_messages.get(code, "Unknown error code"))
        
def shift_character(c: str, shift: int) -> str:
    asciiValue = ord(c)
    newValue = ((asciiValue - min + shift) % span) + min
    return chr(newValue)

def encrypt(inputText: str, N: int = 5, D: int = -1) -> str:
    """Encrypt text using defaults N=5, D=-1 unless overridden."""
    encryptText = ""
    error_code_to_message(validate_parameters(inputText, N, D))
    # Reverse the input
    rev = inputText[::-1]

    # Loop through all characters
    for i, c in enumerate(rev):
        shift = N * D
        encryptText += shift_character(c, shift)

    return encryptText

def decrypt(encryptedText: str, N: int = 5, D: int = -1) -> str:
    """Decrypt text using defaults N=5, D=-1 unless overridden."""
    decryptText = ""
    error_code_to_message(validate_parameters(encryptedText, N, D))
    # Loop through all characters
    for i, c in enumerate(encryptedText):
        shift = N * -D
        decryptText += shift_character(c, shift)

    # Reverse the decrypted text
    rev = decryptText[::-1]
    return rev
