from dotenv import load_dotenv
load_dotenv()  # must run before assistant.py reads os.environ

from flask import Flask, render_template, request, jsonify, Response, stream_with_context
from assistant import get_reply, stream_reply
import json

app = Flask(__name__, template_folder='templates')

@app.route("/", methods=['GET'])
def index():
    return render_template("index.html")

@app.route("/api/assistant", methods=['POST'])
def assistant():
    data = request.get_json(force=True, silent=True) or {}
    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "No message provided"}), 400
    reply = get_reply(message)
    return jsonify({"reply": reply})

@app.route("/api/assistant/stream", methods=['POST'])
def assistant_stream():
    data = request.get_json(force=True, silent=True) or {}
    message = (data.get("message") or "").strip()
    if not message:
        return jsonify({"error": "No message provided"}), 400

    def generate():
        for chunk in stream_reply(message):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        yield "data: [DONE]\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)