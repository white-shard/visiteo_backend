import { Body, Container, Heading, Hr, Section, Tailwind, Text } from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from "react"

interface Props {
	subject: string
	message: string
	code: string
}
export function VerificationCodeTemplate({
	subject, 
	message,
	code
}: Props): React.JSX.Element {
	return (
		<Tailwind>
			<Html>
				<Body className="bg-gray-50 font-sans">
					<Container className="max-w-md mx-auto py-8">
						<Section className="bg-white rounded-lg shadow-lg p-8">
							{/* Header */}
							<Section className="text-center pb-6">
								<div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										/>
									</svg>
								</div>
								<Heading className="text-2xl font-bold text-gray-900">{subject}</Heading>
							</Section>

							{/* Content */}
							<Section className="space-y-6">
								<Text className="text-gray-600 text-center leading-relaxed">{message}</Text>

								<Hr className="border-gray-200" />

								{/* Verification Code */}
								<Section className="text-center space-y-4">
									<Text className="text-sm text-gray-500 font-medium">КОД ПОДТВЕРЖДЕНИЯ</Text>
									<div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300">
										<Text className="text-4xl font-mono font-bold text-gray-900 tracking-widest">{code}</Text>
									</div>
								</Section>

								<Hr className="border-gray-200" />

								{/* Info */}
								<Section className="space-y-3 text-center">
									<Text className="text-sm text-gray-500">Этот код действителен в течение 1 часа</Text>
									<Text className="text-xs text-gray-400">Если вы не запрашивали этот код, просто проигнорируйте это письмо</Text>
								</Section>

								{/* Warning */}
								<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
									<Text className="text-xs text-blue-700 text-center">
										<strong>Важно:</strong> Никогда не делитесь этим кодом с другими людьми
									</Text>
								</div>
							</Section>
						</Section>

						{/* Footer */}
						<Section className="mt-8 text-center">
							<Text className="text-xs text-gray-400">© 2024 Ваша Компания. Все права защищены.</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	)
}
