"use client";

import React, { useMemo, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

type PlanResponse =
	| { status: "ok"; source: "tool"; data: any }
	| { status: "ok"; source: "model"; text: string }
	| { status: "error"; message: string };

export default function Page() {
	const [topic, setTopic] = useState("");
	const [level, setLevel] = useState("beginner");
	const [weeks, setWeeks] = useState(4);
	const [minutes, setMinutes] = useState(30);
	const [interests, setInterests] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<any | null>(null);

	const canSubmit = useMemo(() => topic.trim().length > 0 && !loading, [topic, loading]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setResult(null);
		setLoading(true);
		try {
			const res = await fetch(`${API_BASE}/api/plan`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					topic,
					audience_level: level,
					duration_weeks: weeks,
					study_minutes: minutes,
					interests: interests || undefined,
				}),
			});
			if (!res.ok) {
				const text = await res.text();
				throw new Error(text || `HTTP ${res.status}`);
			}
			const data: PlanResponse = await res.json();
			if (data.status !== "ok") throw new Error("Unexpected response");
			setResult(data);
		} catch (err: any) {
			setError(err?.message || "Request failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="container">
			<div className="card">
				<div className="icon">📘</div>
				<h1>AI Lesson Plan Generator</h1>
				<p className="subtitle">Transform your teaching ideas into structured, engaging lesson plans in seconds</p>

				<form onSubmit={onSubmit} className="form">
					<label>What do you want to teach?</label>
					<input
						type="text"
						placeholder="e.g., Introduction to Photosynthesis, Basic JavaScript, Creative Writing Techniques..."
						value={topic}
						onChange={(e) => setTopic(e.target.value)}
						required
					/>

					<div className="row">
						<div className="col">
							<label>Experience Level</label>
							<select value={level} onChange={(e) => setLevel(e.target.value)}>
								<option value="beginner">Beginner</option>
								<option value="intermediate">Intermediate</option>
								<option value="advanced">Advanced</option>
							</select>
						</div>
						<div className="col">
							<label>Course Duration</label>
							<select value={weeks} onChange={(e) => setWeeks(parseInt(e.target.value, 10))}>
								{Array.from({ length: 12 }).map((_, i) => (
									<option key={i + 1} value={i + 1}>{i + 1} {i + 1 === 1 ? "week" : "weeks"}</option>
								))}
							</select>
						</div>
					</div>

					<label>Study time per day (minutes)</label>
					<input type="number" min={5} max={600} value={minutes} onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 30)} />

					<label>Student interests or learning preferences (optional)</label>
					<input
						type="text"
						placeholder="e.g., visual learners, loves storytelling, real-world applications..."
						value={interests}
						onChange={(e) => setInterests(e.target.value)}
					/>

					<button type="submit" className="cta" disabled={!canSubmit}>{loading ? "Generating..." : "Generate Lesson Plan"}</button>
				</form>

				{error && <div className="error">{error}</div>}

				{result && (
					<div className="result">
						<h2>Curriculum Plan</h2>
						<pre>{JSON.stringify(result, null, 2)}</pre>
					</div>
				)}
			</div>
		</div>
	);
}
