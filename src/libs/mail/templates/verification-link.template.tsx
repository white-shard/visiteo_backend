import { config } from "src/libs/config/app.config"
import {
	Body,
	Container,
	Heading,
	Hr,
	Section,
	Tailwind,
	Text,
	Img,
	Button
} from "@react-email/components"
import { Html } from "@react-email/html"
import * as React from "react"

interface Props {
	subject: string
	message: string
	url: string
	/**
	 * Время, в течение которого ссылка действительна
	 * @default "1 часа"
	 * @example "Ссылка действительна в течение ${expiresIn}"
	 */
	expiresIn?: string
}
export function VerificationLinkTemplate({
	subject,
	message,
	url,
	expiresIn = "1 часа"
}: Props): React.JSX.Element {
	return (
		<Tailwind>
			<Html>
				<Body className="bg-gray-100 font-sans">
					<Container className="max-w-md mx-auto py-8">
						<Section className="bg-white rounded-lg shadow-lg p-8">
							{/* Header */}
							<Section className="text-center pb-6">
								<Img
									src={`${config.ALLOWED_ORIGIN}/mail-logo.png`}
									className="h-12"
								/>
								<Heading className="text-2xl font-bold text-gray-900">
									{subject}
								</Heading>
							</Section>

							{/* Content */}
							<Section className="space-y-6">
								<Text className="text-gray-600 text-center leading-relaxed">
									{message}
								</Text>

								<Hr className="border-gray-200" />

								{/* Verification Button */}
								<Section className="text-center space-y-4">
									<Text className="text-sm text-gray-500 font-medium">
										ПЕРЕЙДИТЕ ПО ССЫЛКЕ ДЛЯ ПОДТВЕРЖДЕНИЯ
									</Text>
									<Button
										href={url}
										className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
									>
										Подтвердить
									</Button>
								</Section>

								<Hr className="border-gray-200" />

								{/* Info */}
								<Section className="space-y-3 text-center">
									<Text className="text-sm text-gray-500">
										Ссылка действительна в течение {expiresIn}
									</Text>
									<Text className="text-xs text-gray-400">
										Если вы не запрашивали подтверждение, просто проигнорируйте
										это письмо
									</Text>
								</Section>

								{/* Warning */}
								<div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
									<Text className="text-xs text-blue-700 text-center">
										<strong>Важно:</strong> Никогда не делитесь этой ссылкой с
										другими людьми
									</Text>
								</div>
							</Section>
						</Section>

						{/* Footer */}
						<Section className="mt-8 text-center">
							<Text className="text-xs text-gray-400">
								© 2025 White Shard. Все права защищены.
							</Text>
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	)
}
